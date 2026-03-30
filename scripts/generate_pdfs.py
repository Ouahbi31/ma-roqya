#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génération des 4 PDFs d'invocations islamiques pour ma-roqya.fr
"""

import os
import sys

# Arabic text processing
import arabic_reshaper
from bidi.algorithm import get_display

# ReportLab
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas as canvas_module

# ─── Polices ────────────────────────────────────────────────────────────────
ARABIC_FONT_PATH = "/Library/Fonts/Arial Unicode.ttf"
ARABIC_FONT_NAME = "ArabicFont"

pdfmetrics.registerFont(TTFont(ARABIC_FONT_NAME, ARABIC_FONT_PATH))

# ─── Couleurs ────────────────────────────────────────────────────────────────
COLORS = {
    "ayn":    colors.HexColor("#C9A227"),   # or
    "sihr":   colors.HexColor("#1E3A5F"),   # bleu nuit
    "mass":   colors.HexColor("#2C4A6E"),   # bleu-gris
    "waswas": colors.HexColor("#5C4033"),   # brun
}

OUTPUT_DIR = "/Users/ouahbi/Roqya Guide/ruqyaguide/public/pdf"

# ─── Helper : reshape Arabic ─────────────────────────────────────────────────
def reshape_arabic(text: str) -> str:
    """Reshape + bidi for RTL display."""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)


# ─── Watermark / Header / Footer canvas callback ────────────────────────────
def make_canvas_callback(title_main: str, accent_color):
    """Returns an onFirstPage/onLaterPages canvas callback."""

    def _draw(canv, doc):
        w, h = A4
        # ── Filigrane ──────────────────────────────────────────────────────
        canv.saveState()
        canv.setFont("Helvetica", 60)
        canv.setFillColor(accent_color, alpha=0.04)
        canv.translate(w / 2, h / 2)
        canv.rotate(45)
        canv.drawCentredString(0, 0, "ma-roqya.fr")
        canv.restoreState()

        # ── Bande d'en-tête ────────────────────────────────────────────────
        canv.saveState()
        canv.setFillColor(accent_color)
        canv.rect(0, h - 2.6 * cm, w, 2.6 * cm, fill=1, stroke=0)

        # Titre principal (blanc)
        canv.setFillColor(colors.white)
        canv.setFont("Helvetica-Bold", 13)
        canv.drawCentredString(w / 2, h - 1.4 * cm, title_main)

        # Sous-titre
        canv.setFont("Helvetica", 8)
        canv.drawCentredString(
            w / 2, h - 2.1 * cm,
            "Invocations complémentaires — Programme MaRoqya"
        )
        canv.restoreState()

        # ── Pied de page ───────────────────────────────────────────────────
        canv.saveState()
        canv.setFillColor(colors.HexColor("#888888"))
        canv.setFont("Helvetica", 7.5)
        canv.drawCentredString(w / 2, 0.7 * cm, "ma-roqya.fr")
        page_num = canv.getPageNumber()
        canv.drawRightString(w - 1.5 * cm, 0.7 * cm, f"Page {page_num}")
        # ligne séparatrice pied de page
        canv.setStrokeColor(colors.HexColor("#CCCCCC"))
        canv.setLineWidth(0.5)
        canv.line(1.5 * cm, 1.1 * cm, w - 1.5 * cm, 1.1 * cm)
        canv.restoreState()

    return _draw


# ─── Styles dynamiques ───────────────────────────────────────────────────────
def make_styles(accent_color):
    """Create paragraph styles for a given accent color."""
    styles = {}

    styles["title"] = ParagraphStyle(
        "InvTitle",
        fontName="Helvetica-Bold",
        fontSize=11,
        textColor=accent_color,
        spaceAfter=2,
        spaceBefore=4,
    )
    styles["subtitle"] = ParagraphStyle(
        "InvSubtitle",
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        textColor=colors.HexColor("#666666"),
        spaceAfter=3,
    )
    styles["arabic"] = ParagraphStyle(
        "Arabic",
        fontName=ARABIC_FONT_NAME,
        fontSize=15,
        leading=26,
        alignment=TA_RIGHT,
        spaceAfter=3,
        spaceBefore=3,
        rightIndent=0,
        leftIndent=0,
        textColor=colors.HexColor("#1A1A1A"),
    )
    styles["phonetic"] = ParagraphStyle(
        "Phonetic",
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        textColor=colors.HexColor("#555555"),
        spaceAfter=3,
        leading=12,
    )
    styles["translation"] = ParagraphStyle(
        "Translation",
        fontName="Helvetica",
        fontSize=8.5,
        textColor=colors.HexColor("#333333"),
        spaceAfter=6,
        leading=12,
    )
    styles["note"] = ParagraphStyle(
        "Note",
        fontName="Helvetica-Oblique",
        fontSize=8,
        textColor=colors.HexColor("#777777"),
        spaceAfter=4,
        leading=11,
    )
    return styles


# ─── Bloc invocation ─────────────────────────────────────────────────────────
def invocation_block(num, titre, quand, arabe, phonetique, traduction, styles, accent_color):
    """Build a KeepTogether block for one invocation."""
    elems = []

    # Numéro + Titre
    elems.append(Paragraph(f"{num}. {titre}", styles["title"]))

    # Quand / répétitions
    if quand:
        elems.append(Paragraph(quand, styles["subtitle"]))

    # Texte arabe
    if arabe:
        arabic_display = reshape_arabic(arabe)
        elems.append(Paragraph(arabic_display, styles["arabic"]))

    # Phonétique
    if phonetique:
        elems.append(Paragraph(phonetique, styles["phonetic"]))

    # Traduction
    if traduction:
        elems.append(Paragraph(traduction, styles["translation"]))

    # Séparateur
    elems.append(HRFlowable(
        width="100%", thickness=0.5,
        color=colors.HexColor("#E0E0E0"),
        spaceAfter=8, spaceBefore=2
    ))

    return KeepTogether(elems)


# ─── Note seule (sans arabe) ─────────────────────────────────────────────────
def note_block(num, titre, quand, note_text, styles, accent_color):
    elems = []
    elems.append(Paragraph(f"{num}. {titre}", styles["title"]))
    if quand:
        elems.append(Paragraph(quand, styles["subtitle"]))
    if note_text:
        elems.append(Paragraph(note_text, styles["note"]))
    elems.append(HRFlowable(
        width="100%", thickness=0.5,
        color=colors.HexColor("#E0E0E0"),
        spaceAfter=8, spaceBefore=2
    ))
    return KeepTogether(elems)


# ─── Construction d'un PDF ───────────────────────────────────────────────────
def build_pdf(filename: str, title_main: str, accent_color, invocations: list):
    """
    invocations : list of dicts with keys:
        num, titre, quand, arabe, phonetique, traduction
        OR: num, titre, quand, note (for note-only blocks)
    """
    output_path = os.path.join(OUTPUT_DIR, filename)
    styles = make_styles(accent_color)
    cb = make_canvas_callback(title_main, accent_color)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=3.2 * cm,   # leave room for header band
        bottomMargin=1.8 * cm,
        leftMargin=1.8 * cm,
        rightMargin=1.8 * cm,
    )

    story = []
    story.append(Spacer(1, 0.3 * cm))

    for inv in invocations:
        num = inv.get("num", "")
        titre = inv.get("titre", "")
        quand = inv.get("quand", "")
        arabe = inv.get("arabe", "")
        phonetique = inv.get("phonetique", "")
        traduction = inv.get("traduction", "")
        note = inv.get("note", "")

        if note and not arabe:
            story.append(note_block(num, titre, quand, note, styles, accent_color))
        else:
            story.append(invocation_block(
                num, titre, quand, arabe, phonetique, traduction, styles, accent_color
            ))

    doc.build(story, onFirstPage=cb, onLaterPages=cb)
    size = os.path.getsize(output_path)
    print(f"  ✓ {filename}  ({size // 1024} Ko)")
    return output_path


# ══════════════════════════════════════════════════════════════════════════════
# PDF 1 — 'Ayn (Mauvais Œil)
# ══════════════════════════════════════════════════════════════════════════════
AYN_INVOCATIONS = [
    {
        "num": 1,
        "titre": "Sourate Al-Fatiha",
        "quand": "À réciter 7x — soufflée sur les mains puis passées sur le corps",
        "arabe": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        "phonetique": "Bismillaahi r-rahmaani r-rahiim. Al-hamdu lillaahi rabbi l-'aalamiin. Ar-rahmaani r-rahiim. Maaliki yawmi d-diin. Iyyaaka na'budu wa-iyyaaka nasta'iin. Ihdinaa s-siraata l-mustaqiim. Siraata lladhiina an'amta 'alayhim, ghayri l-maghduubi 'alayhim wa-laa d-daalliin.",
        "traduction": "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur des mondes. Le Tout Miséricordieux, le Très Miséricordieux. Maître du Jour de la rétribution. C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons le secours. Guide-nous vers le droit chemin. Le chemin de ceux que Tu as comblés de bienfaits, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
    },
    {
        "num": 2,
        "titre": "Ayat Al-Kursi",
        "quand": "3x — matin et soir",
        "arabe": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        "phonetique": "Allaahu laa ilaaha illaa huwa l-hayyu l-qayyuum. Laa ta'khudhuhu sinatun wa-laa nawm. Lahuu maa fi s-samaawaati wa-maa fi l-ard. Man dhaa lladhii yashfa'u 'indahu illaa bi-idhnih. Ya'lamu maa bayna aydiihim wa-maa khalfahum. Wa-laa yuhiiduuna bi-shay'in min 'ilmihi illaa bi-maa shaa'. Wasi'a kursiyyuhu s-samaawaati wa-l-ard. Wa-laa ya'uuduhu hifzuhumaa wa-huwa l-'aliyyu l-'aziim.",
        "traduction": "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et ils n'embrassent de Sa science que ce qu'Il veut. Son Trône s'étend sur les cieux et la terre dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
    },
    {
        "num": 3,
        "titre": "La Roqya du Prophète (saw)",
        "quand": "3x — soufflée sur les mains puis le corps",
        "arabe": "بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ بِسْمِ اللَّهِ أَرْقِيكَ",
        "phonetique": "Bismilaahi arqiika, min kulli shay'in yu'dhiika, min sharri kulli nafsin aw 'ayni haasidin, Allaahu yashfiika, bismillaahi arqiika.",
        "traduction": "Au nom d'Allah, je te fais la roqya contre tout ce qui te nuit, contre le mal de toute âme et de tout œil envieux. Qu'Allah te guérisse ! Au nom d'Allah, je te fais la roqya.",
    },
    {
        "num": 4,
        "titre": "Doua pour guérir du 'Ayn",
        "quand": "3x — sur la zone douloureuse",
        "arabe": "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ وَاشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
        "phonetique": "Allaahumma rabba n-naasi, adhhib il-ba'sa wa-shfi, anta sh-shaafi, laa shifaa'a illaa shifaa'uka, shifaa'an laa yughaadiiru saqamaa.",
        "traduction": "Ô Allah, Seigneur des hommes, éloigne la douleur et guéris, Tu es le Guérisseur, il n'y a pas de guérison sauf Ta guérison, une guérison qui n'laisse aucune maladie.",
    },
    {
        "num": 5,
        "titre": "Protection contre l'envie",
        "quand": "7x — matin",
        "arabe": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        "phonetique": "A'uudhu bi-kalimaati llaahi t-taammati min sharri maa khalaq.",
        "traduction": "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    },
    {
        "num": 6,
        "titre": "Hasbi Allah — Invocation de confiance",
        "quand": "7x — matin et soir",
        "arabe": "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        "phonetique": "Hasbiya llaahu laa ilaaha illaa huwa, 'alayhi tawakkaltu wa-huwa rabbu l-'arshi l-'aziim.",
        "traduction": "Allah me suffit, il n'y a de divinité que Lui, je m'en remets à Lui et Il est le Seigneur du Trône immense. (Sourate At-Tawbah 9:129)",
    },
    {
        "num": 7,
        "titre": "Sourate Al-Ikhlas",
        "quand": "3x",
        "arabe": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        "phonetique": "Qul huwa llaahu ahad. Allaahu s-samad. Lam yalid wa-lam yuulad. Wa-lam yakun lahuu kufuwan ahad.",
        "traduction": "Dis : 'Il est Allah, Unique. Allah, le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.'",
    },
    {
        "num": 8,
        "titre": "Sourate Al-Falaq",
        "quand": "3x",
        "arabe": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        "phonetique": "Qul a'uudhu bi-rabbi l-falaq. Min sharri maa khalaq. Wa-min sharri ghaasiqin idhaa waqab. Wa-min sharri n-naffaathaati fi l-'uqad. Wa-min sharri haasidin idhaa hasad.",
        "traduction": "Dis : 'Je cherche refuge auprès du Seigneur de l'aube naissante, contre le mal de ce qu'Il a créé, contre le mal de l'obscurité quand elle s'étend, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie.'",
    },
    {
        "num": 9,
        "titre": "Sourate An-Nas",
        "quand": "3x",
        "arabe": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
        "phonetique": "Qul a'uudhu bi-rabbi n-naas. Maliki n-naas. Ilaahi n-naas. Min sharri l-waswaasi l-khannaas. Alladhii yuwaswisu fii suduuri n-naas. Mina l-jinnati wa-n-naas.",
        "traduction": "Dis : 'Je cherche refuge auprès du Seigneur des hommes, du Roi des hommes, du Dieu des hommes, contre le mal du mauvais conseiller, le sournois qui souffle le mal dans les poitrines des hommes, qu'il soit djinn ou être humain.'",
    },
]

# ══════════════════════════════════════════════════════════════════════════════
# PDF 2 — Sihr (Sorcellerie)
# ══════════════════════════════════════════════════════════════════════════════
SIHR_INVOCATIONS = [
    {
        "num": 1,
        "titre": "Versets de Musa contre les sorciers — Sourate Al-A'raf 7:117-122",
        "quand": "3x",
        "arabe": "وَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنْ أَلْقِ عَصَاكَ فَإِذَا هِيَ تَلْقَفُ مَا يَأْفِكُونَ ۝ فَوَقَعَ الْحَقُّ وَبَطَلَ مَا كَانُوا يَعْمَلُونَ ۝ فَغُلِبُوا هُنَالِكَ وَانْقَلَبُوا صَاغِرِينَ ۝ وَأُلْقِيَ السَّحَرَةُ سَاجِدِينَ ۝ قَالُوا آمَنَّا بِرَبِّ الْعَالَمِينَ ۝ رَبِّ مُوسَىٰ وَهَارُونَ",
        "phonetique": "Wa-awhaynaa ilaa Muusaa an alqi 'asaaka fa-idhaa hiya talqafu maa ya'fikuun. Fa-waqa'a l-haqqu wa-batala maa kaanuu ya'maluun. Fa-ghulibuу hunaaliika wa-nqalabuu saaghiriin. Wa-ulqiya s-saharatu saajidiin. Qaaluu aamannaa bi-rabbi l-'aalamiin. Rabbi Muusaa wa-Haaruun.",
        "traduction": "Et Nous révélâmes à Moïse : 'Lance ton bâton.' Et voilà qu'il engloutit ce qu'ils falsifiaient. Ainsi la vérité fut établie et ce qu'ils faisaient s'anéantit. Là, ils furent vaincus et devinrent humiliés. Et les magiciens se prosternèrent. Ils dirent : 'Nous croyons au Seigneur des mondes, le Seigneur de Moïse et Aaron.'",
    },
    {
        "num": 2,
        "titre": "Versets de Yunus 10:79-82",
        "quand": "3x",
        "arabe": "وَقَالَ فِرْعَوْنُ ائْتُونِي بِكُلِّ سَاحِرٍ عَلِيمٍ ۝ فَلَمَّا جَاءَ السَّحَرَةُ قَالَ لَهُمْ مُوسَىٰ أَلْقُوا مَا أَنْتُمْ مُلْقُونَ ۝ فَلَمَّا أَلْقَوْا قَالَ مُوسَىٰ مَا جِئْتُمْ بِهِ السِّحْرُ إِنَّ اللَّهَ سَيُبْطِلُهُ إِنَّ اللَّهَ لَا يُصْلِحُ عَمَلَ الْمُفْسِدِينَ ۝ وَيُحِقُّ اللَّهُ الْحَقَّ بِكَلِمَاتِهِ وَلَوْ كَرِهَ الْمُجْرِمُونَ",
        "phonetique": "Wa-qaala fir'awnu 'tuunii bi-kulli saahirin 'aliim. Fa-lammaa jaa'a s-saharatu qaala lahum Muusaa alquu maa antum mulquun. Fa-lammaa alqaw qaala Muusaa maa ji'tum bihi s-sihru, inna llaaha sa-yubtiluh, inna llaaha laa yuslihu 'amala l-mufsiidiin. Wa-yuhiqqu llaahu l-haqqa bi-kalimaatihi wa-law kariha l-mujrimuun.",
        "traduction": "Pharaon dit : 'Amenez-moi tout magicien compétent.' Et quand les magiciens vinrent, Moïse leur dit : 'Jetez ce que vous voulez jeter.' Quand ils eurent jeté, Moïse dit : 'Ce que vous avez apporté, c'est de la sorcellerie. Allah va certainement l'annuler. Allah ne rend pas saine l'œuvre des corrupteurs. Et Allah confirme la vérité par Ses paroles, en dépit de ce que détestent les criminels.'",
    },
    {
        "num": 3,
        "titre": "Versets de Taha 20:65-70",
        "quand": "3x",
        "arabe": "قَالُوا يَا مُوسَىٰ إِمَّا أَنْ تُلْقِيَ وَإِمَّا أَنْ نَكُونَ أَوَّلَ مَنْ أَلْقَىٰ ۝ قَالَ بَلْ أَلْقُوا فَإِذَا حِبَالُهُمْ وَعِصِيُّهُمْ يُخَيَّلُ إِلَيْهِ مِنْ سِحْرِهِمْ أَنَّهَا تَسْعَىٰ ۝ فَأَوْجَسَ فِي نَفْسِهِ خِيفَةً مُوسَىٰ ۝ قُلْنَا لَا تَخَفْ إِنَّكَ أَنْتَ الْأَعْلَىٰ ۝ وَأَلْقِ مَا فِي يَمِينِكَ تَلْقَفْ مَا صَنَعُوا إِنَّمَا صَنَعُوا كَيْدُ سَاحِرٍ وَلَا يُفْلِحُ السَّاحِرُ حَيْثُ أَتَىٰ",
        "phonetique": "Qaaluu yaa Muusaa immaa an tulqiya wa-immaa an nakuuna awwala man alqaa. Qaala bal alquu, fa-idhaa hibaaluhum wa-'isiyyuhum yukhayyalu ilayhi min sihrihim annahaa tas'aa. Fa-awjasa fii nafsihi khiifatan Muusaa. Qulnaa laa takhaf innaka anta l-a'laa. Wa-alqi maa fii yamiinika talqaf maa sana'uu, innamaa sana'uu kaydu saahirin wa-laa yuflihu s-saahiru haytu ataa.",
        "traduction": "Ils dirent : 'Ô Moïse, ou bien tu jettes, ou bien nous serons les premiers à jeter.' Il dit : 'Non, jetez.' Et voilà que leurs cordes et leurs bâtons lui semblaient, par leur magie, ramper. Alors Moïse ressentit en lui-même une peur. Nous dîmes : 'N'aie pas peur ! C'est toi qui seras le plus fort. Lance ce que tu tiens dans ta main droite : elle engloutira ce qu'ils ont fabriqué. Ce qu'ils ont fabriqué n'est qu'un stratagème de magicien. Et le magicien ne réussit pas, où qu'il aille.'",
    },
    {
        "num": 4,
        "titre": "Istighfar intensif",
        "quand": "100x par jour",
        "arabe": "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
        "phonetique": "Astaghfiru llaaha l-'aziima lladhii laa ilaaha illaa huwa l-hayyu l-qayyuumu wa-atuubu ilayh.",
        "traduction": "Je demande pardon à Allah, le Très Grand, Celui à part qui il n'y a pas de divinité, le Vivant, le Subsistant, et je me repens à Lui.",
    },
    {
        "num": 5,
        "titre": "Doua de dissolution du sihr",
        "quand": "3x",
        "arabe": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ",
        "phonetique": "Allaahumma anta rabbii, laa ilaaha illaa anta, khalaqtanii wa-anaa 'abduka, wa-anaa 'alaa 'ahdika wa-wa'dika ma stata'tu, a'uudhu bika min sharri maa sana'tu.",
        "traduction": "Ô Allah, Tu es mon Seigneur, il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur. Je suis dans mon engagement et ma promesse envers Toi autant que je le peux. Je cherche refuge en Toi contre le mal de ce que j'ai commis.",
    },
    {
        "num": 6,
        "titre": "Ayat Al-Kursi",
        "quand": "3x",
        "arabe": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        "phonetique": "Allaahu laa ilaaha illaa huwa l-hayyu l-qayyuum. Laa ta'khudhuhu sinatun wa-laa nawm. Lahuu maa fi s-samaawaati wa-maa fi l-ard. Man dhaa lladhii yashfa'u 'indahu illaa bi-idhnih. Ya'lamu maa bayna aydiihim wa-maa khalfahum. Wa-laa yuhiiduuna bi-shay'in min 'ilmihi illaa bi-maa shaa'. Wasi'a kursiyyuhu s-samaawaati wa-l-ard. Wa-laa ya'uuduhu hifzuhumaa wa-huwa l-'aliyyu l-'aziim.",
        "traduction": "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et ils n'embrassent de Sa science que ce qu'Il veut. Son Trône s'étend sur les cieux et la terre dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
    },
    {
        "num": 7,
        "titre": "Les 3 Qul (Mu'awwidhat)",
        "quand": "7x chacune",
        "arabe": "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        "phonetique": "Qul huwa llaahu ahad / Qul a'uudhu bi-rabbi l-falaq / Qul a'uudhu bi-rabbi n-naas",
        "traduction": "Réciter Al-Ikhlas (l'Unicité), Al-Falaq (l'Aube naissante) et An-Nas (Les Hommes) — 7 fois chacune. Ces sourates constituent la protection suprême contre la sorcellerie.",
    },
]

# ══════════════════════════════════════════════════════════════════════════════
# PDF 3 — Mass (Possession)
# ══════════════════════════════════════════════════════════════════════════════
MASS_INVOCATIONS = [
    {
        "num": 1,
        "titre": "Ta'awwudh complet",
        "quand": "Avant chaque séance de roqya",
        "arabe": "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ مِنْ هَمْزِهِ وَنَفْخِهِ وَنَفْثِهِ",
        "phonetique": "A'uudhu billaahi s-samii'i l-'aliimi mina sh-shaytaani r-rajiim, min hamzihi wa-nafkhihi wa-nafthih.",
        "traduction": "Je cherche refuge auprès d'Allah, l'Omniscient, le Tout-Entendant, contre le diable maudit — contre sa folie, son arrogance et sa poésie pernicieuse.",
    },
    {
        "num": 2,
        "titre": "Doua pendant la séance de roqya",
        "quand": "Répéter plusieurs fois durant la séance",
        "arabe": "اللَّهُمَّ رَبَّ النَّاسِ مُذْهِبَ الْبَأْسِ اشْفِ أَنْتَ الشَّافِي لَا شَافِيَ إِلَّا أَنْتَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
        "phonetique": "Allaahumma rabba n-naasi, mudhhiba l-ba'si, ishfi anta sh-shaafii, laa shaafiya illaa anta, shifaa'an laa yughaadiiru saqamaa.",
        "traduction": "Ô Allah, Seigneur des hommes, Celui qui éloigne la souffrance, guéris — Tu es le Guérisseur, il n'y a de guérisseur que Toi — d'une guérison qui n'laisse aucune trace de maladie.",
    },
    {
        "num": 3,
        "titre": "Protection contre les djinns — Sourate Al-Baqara 2:285-286",
        "quand": "1x — chaque soir",
        "arabe": "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
        "phonetique": "Aamana r-rasuulu bi-maa unzila ilayhi min rabbihi wa-l-mu'minuun, kullun aamana billaahi wa-malaa'ikatihi wa-kutubihi wa-rusulihi, laa nufarriqu bayna ahadin min rusulihi, wa-qaaluu sami'naa wa-ata'naa, ghufraanaka rabbanaa wa-ilayka l-masiir.",
        "traduction": "Le Messager a cru en ce qu'on a fait descendre vers lui venant de son Seigneur, et les croyants aussi. Chacun a cru en Allah, en Ses anges, en Ses livres et en Ses messagers. Nous ne faisons pas de différence entre Ses messagers. Et ils ont dit : 'Nous avons entendu et obéi ! Accorde-nous Ton pardon, notre Seigneur, car c'est Toi notre destination.'",
    },
    {
        "num": 4,
        "titre": "Bismillah — Protection de la maison",
        "quand": "À répéter en entrant dans chaque pièce",
        "arabe": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        "phonetique": "Bismillaahi lladhii laa yadurru ma'a smihi shay'un fi l-ardi wa-laa fi s-samaa'i wa-huwa s-samii'u l-'aliim.",
        "traduction": "Au nom d'Allah avec dont le Nom rien ne peut nuire ni sur terre ni au ciel. Et Il est l'Omniscient, le Tout-Entendant.",
    },
    {
        "num": 5,
        "titre": "Doua d'expulsion — Ibn Qayyim",
        "quand": "3x — avec intention ferme",
        "arabe": "أَعُوذُ بِوَجْهِ اللَّهِ الْكَرِيمِ وَبِكَلِمَاتِ اللَّهِ التَّامَّاتِ الَّتِي لَا يُجَاوِزُهُنَّ بَرٌّ وَلَا فَاجِرٌ مِنْ شَرِّ مَا يَنْزِلُ مِنَ السَّمَاءِ وَمِنْ شَرِّ مَا يَعْرُجُ فِيهَا وَمِنْ شَرِّ مَا ذَرَأَ فِي الْأَرْضِ وَمِنْ شَرِّ مَا يَخْرُجُ مِنْهَا",
        "phonetique": "A'uudhu bi-wajhi llaahi l-kariimi wa-bi-kalimaati llaahi t-taammaati llatii laa yujaawiizuhunna barrun wa-laa faajirun, min sharri maa yanzilu mina s-samaa'i wa-min sharri maa ya'ruju fiihaa, wa-min sharri maa dhara'a fi l-ardi wa-min sharri maa yakhruju minhaa.",
        "traduction": "Je cherche refuge par la Face Noble d'Allah et par les paroles parfaites d'Allah que nul homme pieux ni pécheur ne peut dépasser — contre le mal de ce qui descend du ciel et de ce qui y monte, contre le mal de ce qui est répandu sur terre et de ce qui en sort.",
    },
    {
        "num": 6,
        "titre": "Sourate Al-Mulk",
        "quand": "Chaque soir avant de dormir (complète)",
        "note": "Réciter la sourate Al-Mulk complète — elle protège contre le châtiment de la tombe et les djinns nocturnes. (Sourate 67, 30 versets)",
    },
    {
        "num": 7,
        "titre": "Dhikr continu contre le mass",
        "quand": "100x dans la journée",
        "arabe": "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        "phonetique": "Laa ilaaha illaa llaahu wahdahu laa shariika lah, lahu l-mulku wa-lahu l-hamdu wa-huwa 'alaa kulli shay'in qadiir.",
        "traduction": "Il n'y a de divinité qu'Allah, Seul, sans associé. À Lui la Royauté et à Lui la louange. Et Il est Omnipotent.",
    },
]

# ══════════════════════════════════════════════════════════════════════════════
# PDF 4 — Waswas (Pensées obsessionnelles)
# ══════════════════════════════════════════════════════════════════════════════
WASWAS_INVOCATIONS = [
    {
        "num": 1,
        "titre": "Ta'awwudh — La règle d'or",
        "quand": "Dès qu'une pensée obsessionnelle surgit",
        "arabe": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        "phonetique": "A'uudhu billaahi mina sh-shaytaani r-rajiim.",
        "traduction": "Je cherche refuge auprès d'Allah contre le diable maudit.",
    },
    {
        "num": 2,
        "titre": "La réponse du croyant aux waswas — (Muslim)",
        "quand": "3x — si les waswas deviennent intenses",
        "arabe": "آمَنْتُ بِاللَّهِ وَرُسُلِهِ",
        "phonetique": "Aamantu billaahi wa-rusulihi.",
        "traduction": "Je crois en Allah et en Ses messagers.",
    },
    {
        "num": 3,
        "titre": "Doua d'Al-Mu'awwidhat après chaque prière",
        "quand": "3x — après chaque salat",
        "arabe": "قُلْ هُوَ اللَّهُ أَحَدٌ / قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ / قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        "phonetique": "Qul huwa llaahu ahad / Qul a'uudhu bi-rabbi l-falaq / Qul a'uudhu bi-rabbi n-naas",
        "traduction": "Les 3 Qul — Réciter Al-Ikhlas, Al-Falaq et An-Nas 3 fois chacune après chaque prière.",
    },
    {
        "num": 4,
        "titre": "La Hawla — Contre l'impuissance face aux waswas",
        "quand": "À répéter quand on se sent dépassé",
        "arabe": "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
        "phonetique": "Laa hawla wa-laa quwwata illaa billaahi l-'aliyyi l-'aziim.",
        "traduction": "Il n'y a de force ni de puissance qu'en Allah, le Très Haut, le Très Grand.",
    },
    {
        "num": 5,
        "titre": "Dhikr actif pour occuper l'esprit",
        "quand": "Alterner en boucle pendant 10 min",
        "arabe": "سُبْحَانَ اللَّهِ — الْحَمْدُ لِلَّهِ — اللَّهُ أَكْبَرُ",
        "phonetique": "Subhaana llaah (33x) — Al-hamdu lillaah (33x) — Allaahu akbar (34x)",
        "traduction": "Gloire à Allah (33x) — Louange à Allah (33x) — Allah est le plus Grand (34x). Total : 100 dhikr.",
    },
    {
        "num": 6,
        "titre": "Doua du Prophète (saw) contre les waswas de la prière",
        "quand": "Avant de commencer la prière",
        "arabe": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّيْطَانِ مِنْ هَمْزِهِ وَنَفْخِهِ وَنَفْثِهِ",
        "phonetique": "Allaahumma innii a'uudhu bika mina sh-shaytaani min hamzihi wa-nafkhihi wa-nafthih.",
        "traduction": "Ô Allah, je cherche refuge en Toi contre le démon — contre sa folie, son arrogance et sa poésie pernicieuse.",
    },
    {
        "num": 7,
        "titre": "Ayat Al-Kursi après chaque prière",
        "quand": "1x — après chaque salat obligatoire",
        "arabe": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        "phonetique": "Allaahu laa ilaaha illaa huwa l-hayyu l-qayyuum. Laa ta'khudhuhu sinatun wa-laa nawm. Lahuu maa fi s-samaawaati wa-maa fi l-ard. Man dhaa lladhii yashfa'u 'indahu illaa bi-idhnih. Ya'lamu maa bayna aydiihim wa-maa khalfahum. Wa-laa yuhiiduuna bi-shay'in min 'ilmihi illaa bi-maa shaa'. Wasi'a kursiyyuhu s-samaawaati wa-l-ard. Wa-laa ya'uuduhu hifzuhumaa wa-huwa l-'aliyyu l-'aziim.",
        "traduction": "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et ils n'embrassent de Sa science que ce qu'Il veut. Son Trône s'étend sur les cieux et la terre dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
    },
    {
        "num": 8,
        "titre": "Invocation de sérénité — Doua de la quiétude",
        "quand": "Matin et soir",
        "arabe": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ وَأَسْأَلُكَ شُكْرَ نِعْمَتِكَ وَحُسْنَ عِبَادَتِكَ",
        "phonetique": "Allaahumma innii as'aluka th-thabaata fi l-amri wa-l-'aziimata 'alaa r-rushdi wa-as'aluka shukra ni'matika wa-husna 'ibaadatika.",
        "traduction": "Ô Allah, je Te demande la stabilité dans les affaires, la détermination à suivre la bonne voie, je Te demande la reconnaissance de Tes bienfaits et la qualité de Ton adoration.",
    },
]


# ─── Main ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Génération des PDFs...")

    build_pdf(
        "ayn-invocations.pdf",
        "Invocations contre le Mauvais Oeil — Programme 'Ayn",
        COLORS["ayn"],
        AYN_INVOCATIONS,
    )

    build_pdf(
        "sihr-invocations.pdf",
        "Invocations contre la Sorcellerie — Programme Sihr",
        COLORS["sihr"],
        SIHR_INVOCATIONS,
    )

    build_pdf(
        "mass-invocations.pdf",
        "Invocations contre la Possession — Programme Mass",
        COLORS["mass"],
        MASS_INVOCATIONS,
    )

    build_pdf(
        "waswas-invocations.pdf",
        "Invocations contre les Pensees Obsessionnelles — Programme Waswas",
        COLORS["waswas"],
        WASWAS_INVOCATIONS,
    )

    print("\nTermine. Fichiers dans :", OUTPUT_DIR)
