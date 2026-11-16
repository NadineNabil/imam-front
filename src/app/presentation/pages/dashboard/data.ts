import { ChartType } from './dashboard.model';

const walletOverview: ChartType = {
  chart: {
    width: 227,
    height: 227,
    type: 'pie'
  },
  colors: ["#777aca", "#5156be", "#a8aada"],
  legend: { show: !1 },
  stroke: {
    width: 0
  },
  series: [35, 70, 15],
  labels: ["Ethereum", "Bitcoin", "Litecoin"],
};

const investedOverview: ChartType = {
  chart: {
    height: 270,
    type: 'radialBar',
    offsetY: -10
  },
  plotOptions: {
    radialBar: {
      startAngle: -130,
      endAngle: 130,
      dataLabels: {
        name: {
          show: false
        },
        value: {
          offsetY: 10,
          fontSize: '18px',
          color: undefined,
          formatter: function (val: any) {
            return val + "%";
          }
        }
      }
    }
  },
  colors: ['#5156be'],
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      gradientToColors: ['#34c38f'],
      shadeIntensity: 0.15,
      inverseColors: !1,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [20, 60],
    },
  },
  stroke: {
    dashArray: 4,
  },
  legend: {
    show: false
  },
  series: [80],
  labels: ['Series A'],
};

const marketOverview: ChartType = {
  chart: {
    height: 400,
    type: 'bar',
    stacked: !0,
    offsetY: -5,
    toolbar: {
      show: !1
    }
  },
  series: [
    {
      name: "Profit",
      data: [
        12.45, 16.2, 8.9, 11.42, 12.6, 18.1, 18.2, 14.16, 11.1, 8.09, 16.34,
        12.88,
      ],
    },
    {
      name: "Loss",
      data: [
        -11.45, -15.42, -7.9, -12.42, -12.6, -18.1, -18.2, -14.16, -11.1,
        -7.09, -15.34, -11.88,
      ],
    },
  ],
  plotOptions: { bar: { columnWidth: "20%" } },
  stroke: {
    curve: 'smooth'
  },
  colors: ["#5156be", "#34c38f"],
  fill: { opacity: 1 },
  dataLabels: { enabled: !1 },
  legend: { show: !1 },
  xaxis: {
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    labels: { rotate: -90 },
  },
};

const walletlineChart: ChartType = {
  series: [
    { data: [2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15] },
  ],
  chart: { type: "line", height: 50, sparkline: { enabled: !0 } },
  colors: ['#5156be'],
  stroke: { curve: "smooth", width: 2 },
  tooltip: {
    fixed: { enabled: !1 },
    x: { show: !1 },
    marker: { show: !1 },
  },
};

const tradeslineChart: ChartType = {
  series: [
    { data: [15, 42, 47, 2, 14, 19, 65, 75, 47, 15, 42, 47, 2, 14, 12] },
  ],
  chart: { type: "line", height: 50, sparkline: { enabled: !0 } },
  colors: ['#5156be'],
  stroke: { curve: "smooth", width: 2 },
  tooltip: {
    fixed: { enabled: !1 },
    x: { show: !1 },
    marker: { show: !1 },
  },
};

const investedlineChart: ChartType = {
  series: [
    { data: [47, 15, 2, 67, 22, 20, 36, 60, 60, 30, 50, 11, 12, 3, 8] },
  ],
  chart: { type: "line", height: 50, sparkline: { enabled: !0 } },
  colors: ['#5156be'],
  stroke: { curve: "smooth", width: 2 },
  tooltip: {
    fixed: { enabled: !1 },
    x: { show: !1 },
    marker: { show: !1 },
  },
};

const profitlineChart: ChartType = {
  series: [
    { data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15] },
  ],
  chart: { type: "line", height: 50, sparkline: { enabled: !0 } },
  colors: ['#5156be'],
  stroke: { curve: "smooth", width: 2 },
  tooltip: {
    fixed: { enabled: !1 },
    x: { show: !1 },
    marker: { show: !1 },
  },
};

const recentActivity = [
  {
    icon: 'bx bx-user-plus font-size-24',
    date: 'Today, 09:15 AM',
    content: 'A new trainee enrolled in the Frontend learning track.',
    coine: 'Registration',
    price: ''
  },
  {
    icon: 'bx bx-book-open font-size-24',
    date: 'Today, 11:30 AM',
    content: 'Angular Advanced course completed successfully.',
    coine: 'Learning',
    price: ''
  },
  {
    icon: 'bx bx-award font-size-24',
    date: 'Yesterday, 03:00 PM',
    content: 'UI/UX Design certificate issued.',
    coine: 'Certification',
    price: ''
  },
  {
    icon: 'bx bx-briefcase-alt font-size-24',
    date: 'Yesterday, 05:20 PM',
    content: 'A proposal was submitted on Upwork.',
    coine: 'Freelancing',
    price: ''
  },
  {
    icon: 'bx bx-message-square-check font-size-24',
    date: '2 days ago',
    content: 'Interview invitation received from a client.',
    coine: 'Projects',
    price: ''
  }
];

const News = [
  {
    icon: 'mdi mdi-currency-btc',
    avatar_icon: 'mdi-bitcoin',
    title: 'Bitcoin',
    content: 'Bitcoin prices fell sharply amid the global sell-off in equities.'
  },
  {
    icon: 'mdi mdi-ethereum',
    avatar_icon: 'mdi-ethereum',
    title: 'ETH',
    content: 'Ethereum prices have been volatile this week.'
  }
];

const transactionsAll = [
  {
    icon: 'bx-book-open',
    title: 'Angular Fundamentals Completed',
    date: '15 Jul, 2026',
    coin: 'Frontend',
    amount: 'Completed'
  },
  {
    icon: 'bx-award',
    title: 'Certificate Issued',
    date: '18 Jul, 2026',
    coin: 'UI/UX',
    amount: 'Earned'
  },
  {
    icon: 'bx-briefcase-alt',
    title: 'Proposal Submitted',
    date: '20 Jul, 2026',
    coin: 'Upwork',
    amount: 'Submitted'
  },
  {
    icon: 'bx-user-check',
    title: 'Interview Invitation',
    date: '22 Jul, 2026',
    coin: 'Freelancer',
    amount: 'Scheduled'
  }
];
const transactionsBuy = [
  {
    icon: 'bx-book',
    title: 'Angular Advanced',
    date: 'Started 10 Jul, 2026',
    coin: 'Frontend',
    amount: '75%'
  },
  {
    icon: 'bx-code-alt',
    title: 'Prompt Engineering',
    date: 'Completed',
    coin: 'AI',
    amount: '100%'
  },
  {
    icon: 'bx-palette',
    title: 'UI/UX Design',
    date: 'In Progress',
    coin: 'Design',
    amount: '60%'
  }
];
const transactionsSell = [
  {
    icon: 'bx-briefcase',
    title: 'E-Commerce Landing Page',
    date: 'Completed',
    coin: 'Upwork',
    amount: 'Delivered'
  },
  {
    icon: 'bx-laptop',
    title: 'Company Portfolio',
    date: 'In Review',
    coin: 'Freelancer',
    amount: 'Pending'
  },
  {
    icon: 'bx-task',
    title: 'Dashboard UI',
    date: 'Interview Stage',
    coin: 'PeoplePerHour',
    amount: 'Awaiting Reply'
  }
];

export { 
  walletOverview, 
  investedOverview, 
  marketOverview, 
  recentActivity, 
  walletlineChart, 
  tradeslineChart, 
  investedlineChart, 
  profitlineChart, 
  News, 
  transactionsAll, 
  transactionsBuy, 
  transactionsSell 
};

