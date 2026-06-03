require('dotenv').config();
const mongoose = require('mongoose');
const Submission = require('./models/submissions');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const students = [
  { name: 'Amahle Dlamini',    email: 'amahle@test.com',    sn: '2023001' },
  { name: 'Lethabo Mokoena',   email: 'lethabo@test.com',   sn: '2023002' },
  { name: 'Sipho Ndlovu',      email: 'sipho@test.com',     sn: '2023003' },
  { name: 'Kefilwe Sithole',   email: 'kefilwe@test.com',   sn: '2023004' },
  { name: 'Tshepo Khumalo',    email: 'tshepo@test.com',    sn: '2023005' },
  { name: 'Nomvula Mahlangu',  email: 'nomvula@test.com',   sn: '2023006' },
  { name: 'Bongani Zulu',      email: 'bongani@test.com',   sn: '2023007' },
  { name: 'Thandi Nkosi',      email: 'thandi@test.com',    sn: '2023008' },
  { name: 'Mpho Molefe',       email: 'mpho@test.com',      sn: '2023009' },
  { name: 'Zanele Dube',       email: 'zanele@test.com',    sn: '2023010' },
  { name: 'Kagiso Tau',        email: 'kagiso@test.com',    sn: '2023011' },
  { name: 'Refilwe Nkuna',     email: 'refilwe@test.com',   sn: '2023012' },
  { name: 'Lwazi Mthembu',     email: 'lwazi@test.com',     sn: '2023013' },
  { name: 'Dineo Kgosi',       email: 'dineo@test.com',     sn: '2023014' },
  { name: 'Siyabonga Cele',    email: 'siyabonga@test.com', sn: '2023015' },
];

// Realistic submissions — mix of high, medium, and low risk
const submissionTemplates = [
  // HIGH RISK (riskScore will be 60+)
  { subjects:[{name:'Mathematics',mark:28,type:'Test'},{name:'Statistics',mark:31,type:'Test'},{name:'Computer Science',mark:45,type:'Assignment'}], attendance:51, absenceDays:18, assignmentsOnTime:'Less than half (below 50%)', studyHours:'Less than 5 hours', missedAssessments:'Yes — 3 or more', studyFeeling:'Very overwhelmed', currentSupport:'No support yet' },
  { subjects:[{name:'Mathematics',mark:34,type:'Exam'},{name:'DBD',mark:40,type:'Test'},{name:'UX Design',mark:52,type:'Project'}], attendance:58, absenceDays:14, assignmentsOnTime:'About half (50–74%)', studyHours:'Less than 5 hours', missedAssessments:'Yes — 3 or more', studyFeeling:'Very overwhelmed', currentSupport:'No support yet' },
  { subjects:[{name:'Mathematics',mark:22,type:'Test'},{name:'Machine Learning',mark:35,type:'Assignment'},{name:'Statistics',mark:29,type:'Test'}], attendance:45, absenceDays:21, assignmentsOnTime:'None submitted', studyHours:'Less than 5 hours', missedAssessments:'Yes — 3 or more', studyFeeling:'Very overwhelmed', currentSupport:'No support yet' },
  { subjects:[{name:'Computer Science',mark:41,type:'Test'},{name:'Mathematics',mark:38,type:'Exam'},{name:'DBD',mark:44,type:'Test'}], attendance:62, absenceDays:12, assignmentsOnTime:'About half (50–74%)', studyHours:'Less than 5 hours', missedAssessments:'Yes — 1 to 2', studyFeeling:'Struggling', currentSupport:'No support yet' },
  // MEDIUM RISK (riskScore 35–59)
  { subjects:[{name:'Mathematics',mark:52,type:'Test'},{name:'Computer Science',mark:61,type:'Assignment'},{name:'Statistics',mark:48,type:'Test'}], attendance:71, absenceDays:9, assignmentsOnTime:'Most of them (75–99%)', studyHours:'5–10 hours', missedAssessments:'Yes — 1 to 2', studyFeeling:'Managing', currentSupport:'No support yet' },
  { subjects:[{name:'Mathematics',mark:55,type:'Exam'},{name:'UX Design',mark:68,type:'Project'},{name:'DBD',mark:59,type:'Test'}], attendance:74, absenceDays:8, assignmentsOnTime:'Most of them (75–99%)', studyHours:'5–10 hours', missedAssessments:'No', studyFeeling:'Managing', currentSupport:'Peer tutoring' },
  { subjects:[{name:'Machine Learning',mark:49,type:'Assignment'},{name:'Mathematics',mark:57,type:'Test'},{name:'Statistics',mark:53,type:'Test'}], attendance:68, absenceDays:10, assignmentsOnTime:'About half (50–74%)', studyHours:'5–10 hours', missedAssessments:'Yes — 1 to 2', studyFeeling:'Struggling', currentSupport:'No support yet' },
  { subjects:[{name:'Computer Science',mark:63,type:'Test'},{name:'DBD',mark:58,type:'Assignment'},{name:'Mathematics',mark:47,type:'Exam'}], attendance:76, absenceDays:7, assignmentsOnTime:'Most of them (75–99%)', studyHours:'5–10 hours', missedAssessments:'No', studyFeeling:'Managing', currentSupport:'Lecturer consultations' },
  { subjects:[{name:'UX Design',mark:71,type:'Project'},{name:'Mathematics',mark:50,type:'Test'},{name:'Statistics',mark:55,type:'Test'}], attendance:72, absenceDays:9, assignmentsOnTime:'Most of them (75–99%)', studyHours:'5–10 hours', missedAssessments:'Yes — 1 to 2', studyFeeling:'Managing', currentSupport:'No support yet' },
  // LOW RISK (riskScore below 35)
  { subjects:[{name:'Mathematics',mark:78,type:'Test'},{name:'Computer Science',mark:82,type:'Assignment'},{name:'DBD',mark:75,type:'Test'}], attendance:91, absenceDays:3, assignmentsOnTime:'All of them (100%)', studyHours:'10–20 hours', missedAssessments:'No', studyFeeling:'Confident', currentSupport:'No support yet' },
  { subjects:[{name:'Statistics',mark:85,type:'Exam'},{name:'Machine Learning',mark:79,type:'Assignment'},{name:'UX Design',mark:88,type:'Project'}], attendance:95, absenceDays:1, assignmentsOnTime:'All of them (100%)', studyHours:'10–20 hours', missedAssessments:'No', studyFeeling:'Confident', currentSupport:'No support yet' },
  { subjects:[{name:'Computer Science',mark:74,type:'Test'},{name:'DBD',mark:81,type:'Assignment'},{name:'Mathematics',mark:69,type:'Exam'}], attendance:88, absenceDays:4, assignmentsOnTime:'All of them (100%)', studyHours:'10–20 hours', missedAssessments:'No', studyFeeling:'Confident', currentSupport:'Peer tutoring' },
  { subjects:[{name:'Mathematics',mark:71,type:'Test'},{name:'Statistics',mark:76,type:'Test'},{name:'UX Design',mark:83,type:'Project'}], attendance:93, absenceDays:2, assignmentsOnTime:'All of them (100%)', studyHours:'10–20 hours', missedAssessments:'No', studyFeeling:'Confident', currentSupport:'No support yet' },
  { subjects:[{name:'Machine Learning',mark:80,type:'Assignment'},{name:'Computer Science',mark:77,type:'Test'},{name:'DBD',mark:84,type:'Test'}], attendance:89, absenceDays:3, assignmentsOnTime:'Most of them (75–99%)', studyHours:'10–20 hours', missedAssessments:'No', studyFeeling:'Confident', currentSupport:'Lecturer consultations' },
  { subjects:[{name:'UX Design',mark:91,type:'Project'},{name:'Statistics',mark:87,type:'Exam'},{name:'Mathematics',mark:73,type:'Test'}], attendance:97, absenceDays:1, assignmentsOnTime:'All of them (100%)', studyHours:'More than 20 hours', missedAssessments:'No', studyFeeling:'Confident', currentSupport:'No support yet' },
];

// Risk calculation (same logic as your riskEngine.js)
function calculateRisk(sub) {
  const avgMark = sub.subjects.reduce((s,x)=>s+x.mark,0)/sub.subjects.length;
  const assignMap = {'All of them (100%)':100,'Most of them (75–99%)':85,'About half (50–74%)':60,'Less than half (below 50%)':30,'None submitted':0};
  const missedMap = {'No':0,'Yes — 1 to 2':50,'Yes — 3 or more':100};
  const assignRate = assignMap[sub.assignmentsOnTime] ?? 70;
  const missedRisk = missedMap[sub.missedAssessments] ?? 0;
  const riskScore = Math.round(
    ((100-avgMark)*0.40) + ((100-sub.attendance)*0.25) +
    ((100-assignRate)*0.20) + (missedRisk*0.15)
  );
  const riskLevel = riskScore>=60?'high':riskScore>=35?'medium':'low';
  return { riskScore, riskLevel };
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const hash = await bcrypt.hash('password123', 10);

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    let user = await User.findOne({ email: s.email });
    if (!user) {
      user = await User.create({
        name: s.name, email: s.email,
        password: hash, studentNumber: s.sn, role: 'student'
      });
      console.log(`Created user: ${s.name}`);
    }

    const tmpl = submissionTemplates[i];
    const { riskScore, riskLevel } = calculateRisk(tmpl);

    await Submission.create({
      student: user._id, ...tmpl, riskScore, riskLevel
    });
    console.log(`Seeded: ${s.name} → ${riskLevel} (${riskScore})`);
  }

  console.log('\nDone! 15 submissions inserted.');
  console.log('Risk distribution: 4 high, 5 medium, 6 low');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });