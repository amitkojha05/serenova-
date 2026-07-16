/**
 * Curated breast-health knowledge base for RAG ingestion.
 *
 * Every entry paraphrases guidance from major U.S. authorities and links
 * to the primary source so answers can cite where the information came
 * from. This is educational content, not medical advice, and is
 * deliberately conservative. Review and refresh against the live source
 * pages periodically — public-health guidance changes.
 *
 * Sources referenced:
 *  - CDC   — Centers for Disease Control and Prevention
 *  - NCI   — National Cancer Institute (NIH)
 *  - ACS   — American Cancer Society
 *  - USPSTF— U.S. Preventive Services Task Force
 *  - FDA   — U.S. Food and Drug Administration
 */

export type SourceDoc = {
  id: string
  text: string
  source: string
  url: string
}

export const KNOWLEDGE_BASE: SourceDoc[] = [
  // ---- What breast cancer is ----
  {
    id: 'cdc-what-is',
    source: 'CDC',
    url: 'https://www.cdc.gov/breast-cancer/about/index.html',
    text: 'Breast cancer is a disease in which cells in the breast grow out of control. It can begin in different parts of the breast, most often in the ducts that carry milk to the nipple or in the lobules that produce milk. Breast cancer can spread outside the breast through blood vessels and lymph vessels; when it spreads to other parts of the body it is said to have metastasized.',
  },
  {
    id: 'nci-types',
    source: 'NCI',
    url: 'https://www.cancer.gov/types/breast',
    text: 'Common types of breast cancer include ductal carcinoma in situ (DCIS), which is non-invasive; invasive ductal carcinoma, the most common invasive type; and invasive lobular carcinoma. Less common forms include inflammatory breast cancer and triple-negative breast cancer. The type and stage of a breast cancer, along with hormone-receptor and HER2 status, guide treatment decisions.',
  },

  // ---- Risk factors ----
  {
    id: 'cdc-risk-factors',
    source: 'CDC',
    url: 'https://www.cdc.gov/breast-cancer/risk-factors/index.html',
    text: 'Risk factors you cannot change include getting older, genetic mutations such as BRCA1 and BRCA2, starting periods before age 12, starting menopause after age 55, having dense breasts, and a personal or family history of breast cancer. Risk factors you may be able to change include being physically inactive, being overweight or having obesity after menopause, taking some forms of hormone therapy, drinking alcohol, and reproductive history such as not being physically active. Having a risk factor does not mean you will get breast cancer, and many people with breast cancer have no obvious risk factors.',
  },
  {
    id: 'nci-brca',
    source: 'NCI',
    url: 'https://www.cancer.gov/about-cancer/causes-prevention/genetics/brca-fact-sheet',
    text: 'BRCA1 and BRCA2 are genes that produce tumor-suppressor proteins. Harmful (pathogenic) variants in these genes substantially increase the lifetime risk of breast and ovarian cancer. People with a strong family history of breast, ovarian, or related cancers may consider genetic counseling and testing. A genetic counselor can help interpret family history and test results and discuss options for increased screening or risk-reducing steps.',
  },

  // ---- Signs & symptoms ----
  {
    id: 'cdc-symptoms',
    source: 'CDC',
    url: 'https://www.cdc.gov/breast-cancer/symptoms/index.html',
    text: 'Warning signs of breast cancer can include a new lump in the breast or underarm, thickening or swelling of part of the breast, irritation or dimpling of breast skin, redness or flaky skin near the nipple or breast, pulling in of the nipple or pain in the nipple area, nipple discharge other than breast milk, any change in the size or shape of the breast, and pain in any area of the breast. These symptoms can be caused by conditions other than cancer. Anyone who notices a change should see a healthcare provider promptly.',
  },

  // ---- Screening & self-awareness ----
  {
    id: 'uspstf-screening',
    source: 'USPSTF',
    url: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening',
    text: 'The U.S. Preventive Services Task Force recommends that women at average risk begin screening mammography at age 40 and continue every two years through age 74. Women should talk with their healthcare provider about their individual situation, including personal and family history, breast density, and personal preferences, to decide on the right screening schedule for them.',
  },
  {
    id: 'acs-screening',
    source: 'ACS',
    url: 'https://www.cancer.org/cancer/types/breast-cancer/screening-tests-and-early-detection.html',
    text: 'The American Cancer Society notes that women should become familiar with how their breasts normally look and feel and report any changes to a healthcare provider right away. ACS guidelines give women the option to begin annual mammograms between ages 40 and 44, recommend annual mammograms from ages 45 to 54, and suggest that women 55 and older may switch to every two years or continue yearly. Women at higher-than-average risk may need MRI in addition to mammography.',
  },
  {
    id: 'cdc-self-awareness',
    source: 'CDC',
    url: 'https://www.cdc.gov/breast-cancer/screening/index.html',
    text: 'Breast self-awareness means knowing how your breasts normally look and feel so you can notice changes. Research has not shown a clear benefit of routine physical breast self-exams alone for finding cancer early, but being aware of changes and reporting them promptly is important. Screening tests such as mammograms can find breast cancer early, before symptoms appear, when it may be easier to treat.',
  },

  // ---- Self-check steps ----
  {
    id: 'self-check-steps',
    source: 'NCI / CDC (educational summary)',
    url: 'https://www.cancer.gov/types/breast/patient/breast-screening-pdq',
    text: 'A breast self-awareness check typically involves looking at your breasts in a mirror with shoulders straight and arms on your hips, checking for changes in size, shape, color, or visible swelling or dimpling; raising your arms to look for the same changes; checking for any nipple discharge; and feeling your breasts while lying down and while standing, using the pads of your fingers in a firm, smooth motion covering the whole breast from collarbone to top of abdomen and armpit to cleavage. Report any new lump, thickening, or change to a healthcare provider. This is for awareness only and does not replace clinical screening.',
  },

  // ---- Prevention ----
  {
    id: 'cdc-prevention',
    source: 'CDC',
    url: 'https://www.cdc.gov/breast-cancer/prevention/index.html',
    text: 'Steps that may help lower breast cancer risk include keeping a healthy weight, being physically active, limiting or avoiding alcohol, and, for those who have children, breastfeeding if possible. If you are taking hormone therapy or oral contraceptives, discuss the risks and benefits with your provider. For people at high risk, providers may discuss additional options such as risk-reducing medicines or, in select cases, surgery.',
  },

  // ---- Treatment overview ----
  {
    id: 'nci-treatment',
    source: 'NCI',
    url: 'https://www.cancer.gov/types/breast/patient/breast-treatment-pdq',
    text: 'Breast cancer treatment depends on the type and stage of the cancer and may include surgery (such as breast-conserving surgery or mastectomy), radiation therapy, chemotherapy, hormone therapy for hormone-receptor-positive cancers, targeted therapy such as HER2-directed drugs, and immunotherapy for certain cancers. Many people receive a combination of treatments. A care team helps plan treatment based on individual factors.',
  },

  // ---- Reconstruction ----
  {
    id: 'acs-reconstruction',
    source: 'ACS',
    url: 'https://www.cancer.org/cancer/types/breast-cancer/reconstruction-surgery.html',
    text: 'Breast reconstruction rebuilds the shape of the breast after mastectomy or, sometimes, lumpectomy. Options include implant-based reconstruction using saline or silicone implants, and autologous or "flap" reconstruction using tissue from another part of the body such as the lower abdomen (DIEP flap) or upper back (latissimus dorsi flap). Reconstruction can be immediate (during the mastectomy) or delayed. Under U.S. federal law, group health plans that cover mastectomy must also cover reconstruction. The choice depends on body type, treatment plan, and personal preference and should be discussed with a plastic surgeon.',
  },
  {
    id: 'reconstruction-diep',
    source: 'NCI (educational summary)',
    url: 'https://www.cancer.gov/publications/dictionaries/cancer-terms/def/diep-flap',
    text: 'A DIEP (deep inferior epigastric perforator) flap uses skin and fat from the lower abdomen to rebuild the breast without sacrificing the abdominal muscle, which can preserve core strength. It creates a soft, natural-feeling result but is a longer operation with recovery often around six to eight weeks. It is one of several autologous reconstruction options.',
  },
  {
    id: 'reconstruction-implant',
    source: 'FDA / ACS (educational summary)',
    url: 'https://www.fda.gov/medical-devices/breast-implants',
    text: 'Implant-based reconstruction uses saline or silicone-gel implants and is often done in stages, sometimes beginning with a tissue expander that is gradually filled before the final implant is placed. Recovery is commonly around four to six weeks. The FDA advises patients to review information on implant risks, including the small risk of BIA-ALCL and other complications, and to discuss monitoring with their surgeon.',
  },
  {
    id: 'ar-vr-planning',
    source: 'Research literature (educational summary)',
    url: 'https://arxiv.org/abs/2309.15893',
    text: 'Three-dimensional simulation and augmented- and virtual-reality tools are increasingly used in plastic surgery consultations to help patients visualize possible outcomes before breast augmentation or reconstruction. Commercial platforms build a 3D model of the patient from standard photographs and let patients and surgeons preview different implant sizes and shapes from multiple angles, which can improve communication and set realistic expectations. Studies suggest individualized 3D previews can increase patient confidence compared with generic 2D images. Simulations are approximations and do not guarantee the final surgical result.',
  },

  // ---- Support & emotional ----
  {
    id: 'support-resources',
    source: 'NCI',
    url: 'https://www.cancer.gov/about-cancer/coping',
    text: 'A cancer diagnosis affects emotional as well as physical health. Support options include talking with your care team, social workers, patient navigators, counselors, and support groups; national resources such as the NCI Cancer Information Service; and organizations that offer peer support. It is common to feel fear, anxiety, or sadness, and reaching out for support is a sign of strength, not weakness.',
  },
  {
    id: 'survival-context',
    source: 'ACS',
    url: 'https://www.cancer.org/cancer/types/breast-cancer/about/how-common-is-breast-cancer.html',
    text: 'Breast cancer is one of the most common cancers among women in the United States, but survival has improved substantially over recent decades thanks to earlier detection and better treatment. When breast cancer is found at an early, localized stage, five-year relative survival is very high. Statistics describe groups of people and cannot predict any individual outcome; a person\u2019s prognosis depends on many personal and tumor factors discussed with their care team.',
  },
]
