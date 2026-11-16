const fs = require('fs');

const htmlPath = 'src/app/presentation/pages/report/report.component.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const arMap = {
  'التقرير': 'Report',
  'نظرة عامة': 'Overview',
  'رحلة المتدرب': 'Trainee Journey',
  'المراحل الست': 'The Six Phases',
  'الإعداد والتفعيل': 'Onboarding & Activation',
  'الفرز والاختيار': 'Screening & Selection',
  'التعلّم المخصص': 'Personalized Learning',
  'التحقق والقياس': 'Validation',
  'محرك العروض': 'Proposal Engine',
  'الحصول على العمل': 'Gig Acquisition',
  'أخرى': 'Other',
  'الخلاصة': 'Conclusion',
  'تقرير المنصة': 'Platform Report',
  'قيد التشغيل': 'Live',
  'يوليو 2026': 'July 2026',
  'تقرير منصّة تدريب وتشغيل': 'Training and Employment Platform Report',
  'من أول تسجيل الدخول… لحد أول عقد Freelance': 'From first login... to first Freelance contract',
  'ITIDA GIGs Program برنامج تدريب وتأهيل يعتمد على منصة': 'ITIDA GIGs Program is a training and qualification program based on the Wfrley platform, designed to take the trainee step by step: from registration and assessment, through AI-personalized learning, to writing a professional Proposal and landing the first real Gig on platforms like Upwork, Freelancer, and Fiverr.',
  'مراحل رئيسية': 'Main Phases',
  'حد أدنى لمستوى الإنجليزي': 'Minimum English Level',
  'مثال Score لتقييم الـ Proposal /100': 'Example Proposal Score /100',
  'منصات Freelancing مستهدفة': 'Targeted Freelancing Platforms',
  'رحلة المتدرب داخل Wfrley': 'Trainee Journey inside Wfrley',
  'ست محطات متصلة ببعض — كل محطة بتبني على اللي قبلها، وكل قرار فيها بيتاخد بمساعدة الذكاء الاصطناعي.': 'Six interconnected stations — each station builds on the previous one, and every decision is made with the help of AI.',
  'إعداد وتفعيل': 'Onboard & Activate',
  'فرز واختيار': 'Screen & Select',
  'تعلّم مخصص': 'Personalize Learning',
  'تحقق وقياس': 'Validate & Measure',
  'محرك عروض': 'Proposal Engine Phase',
  'الحصول على Gig': 'Get a Gig',
  'نقطة البداية بالنسبة لكل متدرب. المرحلة دي بتجمع بيانات المتدرب وتقيسّه بالذكاء الاصطناعي بدل ما تفرض عليه نفس المحتوى زي أي حد تاني — الهدف إن كل واحد ياخد مسار تعلّم مبني على نقاط قوته وضعفه هو بالذات.': 'The starting point for every trainee. This phase collects trainee data and assesses them with AI instead of forcing the same content on everyone — the goal is for each person to get a learning path built specifically on their strengths and weaknesses.',
  'تسجيل المتدربين وإنشاء حساباتهم على المنصة': 'Registering trainees and creating their accounts on the platform',
  'اختبار ذكاء اصطناعي لتحديد المستوى الحالي للمتدرب': 'AI test to determine the current level of the trainee',
  'تحليل نقاط القوة والضعف بشكل تلقائي': 'Automatic analysis of strengths and weaknesses',
  'بناء Learning Roadmap مخصصة لكل شخص على حدة': 'Building a personalized Learning Roadmap for each individual',
  'مرحلة غربلة بتضمن إن اللي هيكمل في البرنامج جاهز فعلًا. بتجمع بين تقييم آلي سريع وتقييم بشري في الآخر، عشان القرار النهائي ميبقاش على الذكاء الاصطناعي لوحده.': 'A filtering phase that ensures those who continue in the program are truly ready. It combines a quick automated assessment with a final human evaluation, so the final decision isn\'t left to AI alone.',
  'تقديم الطلب من المتدرب': 'Application submission by the trainee',
  'AI Interview أولي': 'Initial AI Interview',
  'امتحان لغة إنجليزية بحد أدنى مستوى B1': 'English language exam with a minimum B1 level',
  'امتحان Technical في التخصص': 'Technical exam in the specialization',
  'تقييم شامل بالذكاء الاصطناعي': 'Comprehensive AI assessment',
  'Interview نهائي مع شخص حقيقي': 'Final Interview with a real person',
  'تقسيم المتدربين المقبولين حسب مستواهم': 'Categorizing accepted trainees according to their level',
  'هنا فعليًا بيبدأ التعليم. كل متدرب بياخد Learning Path خاصة بيه، ومعاه AI Assistant بيتكلم عربي عشان يقرّب المحتوى ويسهّل المتابعة اليومية.': 'This is where learning actually begins. Every trainee gets a personalized Learning Path, and they have an AI Assistant that speaks Arabic to bring the content closer and facilitate daily follow-up.',
  'Learning Path مخصصة لكل متدرب': 'Personalized Learning Path for each trainee',
  'AI Assistant بالعربي للمساعدة أثناء التعلّم': 'Arabic AI Assistant to help during learning',
  'جلسات Coaching': 'Coaching sessions',
  'متابعة مستمرة لتقدّم المتدرب': 'Continuous monitoring of the trainee\'s progress',
  'KPI Dashboard لعرض الأداء': 'KPI Dashboard to display performance',
  'شهادات عند إنهاء كل مسار': 'Certificates upon completing each path',
  'بعد ما يخلص المتدرب تعلّمه، المرحلة دي بتتأكد إن الجاهزية دي حقيقية مش بس نظرية، من خلال قياسات فعلية قبل ما نديله ضوء أخضر للانتقال للمرحلة اللي بعدها.': 'After the trainee finishes learning, this phase ensures that this readiness is real and not just theoretical, through actual measurements before giving them the green light to move to the next phase.',
  'اختبارات تحقق من الفهم والمهارة': 'Tests to verify understanding and skill',
  'إصدار الشهادات النهائية': 'Issuance of final certificates',
  'قياس مؤشرات الأداء KPIs': 'Measurement of KPIs',
  'متابعة نسبة التحسّن منذ بداية المسار': 'Tracking the improvement rate since the start of the path',
  'التأكد من جاهزية المتدرب فعليًا لسوق العمل': 'Ensuring the trainee is actually ready for the job market',
  'من أهم مراحل المنصة. بدل ما المتدرب يكتب Proposal من الصفر ويجرّب على المكشوف، الـ AI بيقف جنبه في كل خطوة لحد ما العرض يبقى جاهز للإرسال على Upwork وFreelancer وFiverr.': 'One of the most important phases of the platform. Instead of the trainee writing a Proposal from scratch and trying blindly, the AI stands by them every step of the way until the offer is ready to be sent on Upwork, Freelancer, and Fiverr.',
  'مساعدة المتدرب في كتابة الـ Proposal': 'Assisting the trainee in writing the Proposal',
  'تحسين اللغة المستخدمة': 'Improving the language used',
  'تصحيح الأخطاء النحوية Grammar': 'Correcting grammatical errors',
  'تقييم الـ Proposal قبل الإرسال': 'Evaluating the Proposal before sending',
  'إعطاء Score رقمي للعرض (مثال: 85/100)': 'Giving a numerical Score to the offer (example: 85/100)',
  'مثال تقييم عرض': 'Proposal evaluation example',
  'Proposal Score قبل الإرسال — كل ما زاد الرقم زادت فرصة القبول': 'Proposal Score before sending — the higher the number, the higher the chance of acceptance',
  'المرحلة الأخيرة، واللي بيتحقق فيها الهدف النهائي من البرنامج: إن المتدرب يجيب أول شغل Freelance حقيقي، ويبدأ يحقق دخل فعلي من مهاراته الجديدة.': 'The final phase, where the ultimate goal of the program is achieved: the trainee lands their first real Freelance job, and begins generating actual income from their new skills.',
  'تجميع فرص عمل من مواقع Freelancing المختلفة': 'Gathering job opportunities from various Freelancing sites',
  'ترشيح الوظائف المناسبة لكل متدرب حسب مساره': 'Recommending suitable jobs for each trainee according to their path',
  'مساعدته في اختيار المشاريع الأنسب': 'Assisting them in choosing the most suitable projects',
  'مساعدته في تحسين الـ Proposal الخاص بكل فرصة': 'Assisting them in improving the Proposal for each opportunity',
  'الربط بشركات عبر Wfrley Network': 'Connecting with companies via the Wfrley Network',
  'متابعة عدد الـ Proposals المُرسلة': 'Tracking the number of submitted Proposals',
  'متابعة الـ Interviews': 'Tracking Interviews',
  'متابعة عدد الـ Gigs التي تم الفوز بها': 'Tracking the number of Won Gigs',
  'برنامج ITIDA GIGs عبر منصة Wfrley مش مجرد كورس تدريبي — هو خط إنتاج متكامل بياخد المتدرب من نقطة الصفر (تسجيل وتقييم) لحد نقطة الدخل الفعلي (أول Gig)، وفي كل محطة في الطريق فيه طبقة ذكاء اصطناعي بتقلل الجهد العشوائي وتوجّه المتدرب للخطوة الصح اللي بعدها.': 'The ITIDA GIGs program via the Wfrley platform is not just a training course — it\'s an integrated production line that takes the trainee from point zero (registration and assessment) to the point of actual income (first Gig), and at every station along the way there is an AI layer that reduces random effort and guides the trainee to the right next step.',
  'تقرير داخلي · يوليو 2026': 'Internal Report · July 2026',
  'ITIDA GIGs Program — منصة Wfrley': 'ITIDA GIGs Program — Wfrley Platform'
};

const regexLong = /ITIDA GIGs Program\s*برنامج تدريب وتأهيل يعتمد على منصة\s*Wfrley، المصمّمة لتاخد المتدرب خطوة بخطوة:\s*من التسجيل والتقييم،\s*مرورًا بالتعلّم المخصص بالذكاء الاصطناعي، وصولًا لكتابة\s*Proposal\s*احترافي\s*والحصول على أول\s*Gig\s*حقيقي على منصات مثل\s*Upwork\s*وFreelancer\s*وFiverr\./g;

html = html.replace(regexLong, "{{ 'ITIDA_GIGs_Program_Desc' | translate }}");
arMap['ITIDA_GIGs_Program_Desc'] = "ITIDA GIGs Program برنامج تدريب وتأهيل يعتمد على منصة Wfrley، المصمّمة لتاخد المتدرب خطوة بخطوة: من التسجيل والتقييم، مرورًا بالتعلّم المخصص بالذكاء الاصطناعي، وصولًا لكتابة Proposal احترافي والحصول على أول Gig حقيقي على منصات مثل Upwork وFreelancer وFiverr.";

for(let ar in arMap) {
  if(ar === 'ITIDA_GIGs_Program_Desc') continue;
  const en = arMap[ar];
  let search = ar;
  // escape regex
  search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const reg = new RegExp(search, 'g');
  html = html.replace(reg, "{{ '" + en + "' | translate }}");
}

fs.writeFileSync(htmlPath, html);
console.log(JSON.stringify(arMap, null, 2));
