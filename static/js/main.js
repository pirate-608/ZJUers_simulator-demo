// ===== 星空背景 =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];
let nebulaParticles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 创建星星
function createStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 2500);
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.3,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
            color: getStarColor()
        });
    }
}

function getStarColor() {
    const colors = [
        [255, 255, 255],   // 白色
        [200, 220, 255],   // 蓝白
        [255, 240, 220],   // 暖白
        [180, 200, 255],   // 蓝色
        [255, 200, 180],   // 橙色
        [220, 180, 255],   // 紫色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 创建流星
function createShootingStar() {
    if (Math.random() > 0.008) return;
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: Math.random() * 120 + 60,
        speed: Math.random() * 8 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        decay: Math.random() * 0.015 + 0.008
    });
}

// 动画循环
let time = 0;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time++;

    // 绘制星星
    stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.opacity * (0.7 + 0.3 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${opacity})`;
        ctx.fill();

        // 大星星添加光晕
        if (star.radius > 1.2) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.radius * 3
            );
            gradient.addColorStop(0, `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    });

    // 绘制流星
    createShootingStar();
    shootingStars = shootingStars.filter(s => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= s.decay;

        if (s.opacity <= 0) return false;

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 流星头部光点
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();

        return true;
    });

    requestAnimationFrame(animate);
}

createStars();
animate();

// ===== 国际化 =====
const translations = {
    'zh-CN': {
        title: 'ZJU Oline 演示',
        nav: {
            home: '首页',
            about: '产品定位',
            skills: '核心体验',
            projects: '系统模块',
            contact: '开始使用',
            docs: '文档'
        },
        hero: {
            subtitle: '浙大模拟器项目',
            typewriterPrefix: 'ZJU Oline · ',
            typewriterSuffix: '67656 位浙大人的镜像世界。',
            description: '我在这里放置了 67,656 颗星星，希望每位 ZJUer 都能找到属于自己的那一颗。',
            cta: '开始你的故事',
            scroll: '滚动'
        },
        about: {
            title: '产品定位',
            p1: 'ZJU Oline 以“校园成长模拟”为核心体验，通过课程、事件、论坛与毕业结局构成完整的轻策略玩法闭环。玩家在有限学期内平衡精力、心态、压力与学业表现，推进属于自己的浙大模拟人生。',
            p2: '当前产品首页聚焦三件事：可立即上手的玩法结构、稳定可部署的前后端架构，以及围绕预构建资产的低成本运行模式。',
            stats: {
                rules: '规则模块',
                scenes: '交互场景',
                deployments: '部署模式',
                semesters: '学期周目'
            }
        },
        skills: {
            title: '核心体验',
            cards: [
                {
                    title: '课程策略',
                    desc: '围绕专业课程与学分选择进行资源分配，形成每回合决策张力'
                },
                {
                    title: '随机事件',
                    desc: '预编译事件库驱动多分支选项，支持状态影响与历史去重机制'
                },
                {
                    title: 'CC98 模拟',
                    desc: '基于帖子库的触发词匹配，生成贴近校园语境的论坛信息流反馈'
                },
                {
                    title: '向量检索',
                    desc: '运行时使用 pgvector 检索角色素材，降低云端推理成本与延迟抖动'
                },
                {
                    title: '实时状态同步',
                    desc: 'WebSocket 持续回推角色状态和结果消息，保持主界面反馈连贯'
                },
                {
                    title: '部署可移植',
                    desc: '支持 Docker 本地发布与云端部署，预构建资产可直接随包运行'
                }
            ]
        },
        projects: {
            title: '系统模块',
            cards: [
                {
                    title: '前端交互层',
                    desc: '包含登录、主面板、课程清单、事件弹窗与毕业总结等完整页面流'
                },
                {
                    title: '后端引擎层',
                    desc: '封装游戏回合逻辑、状态计算、事件触发与论坛反馈，保障规则一致性'
                },
                {
                    title: '数据与部署层',
                    desc: '预构建 JSON 与向量 CSV 资产配合导入脚本，面向本地与云端统一交付'
                }
            ]
        },
        contact: {
            title: '开始使用',
            description: '你可以先阅读完整文档，再根据部署指南启动本地实例。ZJU Oline 提供面向开发者与玩家的双入口，支持快速试玩与深度定制。',
            doc: '在线文档入口',
            home: '返回产品首页',
            projects: '查看系统模块',
            skills: '浏览核心体验'
        },
        footer: '✦ ZJU Oline · 浙江大学模拟器产品首页 · 2026'
    },
    en: {
        title: 'ZJU Oline Demo',
        nav: {
            home: 'Home',
            about: 'Positioning',
            skills: 'Core Experience',
            projects: 'System Modules',
            contact: 'Get Started',
            docs: 'Docs'
        },
        hero: {
            subtitle: 'ZJU Simulator Project',
            typewriterPrefix: 'ZJU Oline · ',
            typewriterSuffix: 'A mirror world of 67,656 ZJU students.',
            description: 'I have placed 67,656 stars here, hoping every ZJUer can find one that belongs to them.',
            cta: 'Begin Your Story',
            scroll: 'Scroll'
        },
        about: {
            title: 'Product Positioning',
            p1: 'ZJU Oline centers on a campus-growth simulation. Courses, events, forum activity, and graduation endings form a complete light-strategy loop. Within limited semesters, players balance energy, mindset, pressure, and academic performance to build their own ZJU life simulation.',
            p2: 'The homepage focuses on three things: a playable structure that is ready to use, a stable front-end and back-end architecture, and a low-cost operating model built around precompiled assets.',
            stats: {
                rules: 'Rule Modules',
                scenes: 'Interaction Scenes',
                deployments: 'Deployment Modes',
                semesters: 'Semester Runs'
            }
        },
        skills: {
            title: 'Core Experience',
            cards: [
                {
                    title: 'Course Strategy',
                    desc: 'Allocate resources around major courses and credit choices to create tension in each round'
                },
                {
                    title: 'Random Events',
                    desc: 'A precompiled event library drives branching options with state effects and history deduplication'
                },
                {
                    title: 'CC98 Simulation',
                    desc: 'Trigger-word matching over the post library generates forum feedback that feels close to campus culture'
                },
                {
                    title: 'Vector Retrieval',
                    desc: 'Runtime pgvector retrieval pulls character assets while reducing cloud inference cost and latency jitter'
                },
                {
                    title: 'Realtime Sync',
                    desc: 'WebSocket pushes character state and result messages continuously to keep the main view coherent'
                },
                {
                    title: 'Portable Deployment',
                    desc: 'Docker-local publishing and cloud deployment are both supported, with prebuilt assets shipped in place'
                }
            ]
        },
        projects: {
            title: 'System Modules',
            cards: [
                {
                    title: 'Front-End Interaction Layer',
                    desc: 'Covers the full page flow, including login, dashboard, course lists, event modals, and graduation summaries'
                },
                {
                    title: 'Back-End Engine Layer',
                    desc: 'Encapsulates turn logic, state calculation, event triggering, and forum feedback to keep rules consistent'
                },
                {
                    title: 'Data and Deployment Layer',
                    desc: 'Prebuilt JSON and vector CSV assets work with import scripts for unified local and cloud delivery'
                }
            ]
        },
        contact: {
            title: 'Get Started',
            description: 'Read the full documentation first, then launch a local instance from the deployment guide. ZJU Oline offers two entry points for developers and players, supporting quick trials and deeper customization.',
            doc: 'Online Docs',
            home: 'Back to Homepage',
            projects: 'View System Modules',
            skills: 'Browse Core Experience'
        },
        footer: '✦ ZJU Oline · ZJU Simulator product homepage · 2026'
    }
};

const typewriterEl = document.getElementById('typewriter');
const cursorEl = document.getElementById('cursor');
const langButtons = document.querySelectorAll('.lang-btn');
const i18nNodes = document.querySelectorAll('[data-i18n]');
let currentLocale = getInitialLocale();
let typewriterRunId = 0;

function getInitialLocale() {
    try {
        const savedLocale = localStorage.getItem('zju-oline-lang');
        if (savedLocale === 'zh-CN' || savedLocale === 'en') {
            return savedLocale;
        }
    } catch (error) {
        // Ignore storage access issues and fall back to browser language.
    }

    return navigator.language && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

function getTranslation(dictionary, path) {
    return path.split('.').reduce((current, segment) => {
        if (current && current[segment] !== undefined) {
            return current[segment];
        }
        return undefined;
    }, dictionary);
}

function renderTypewriter(locale, delay) {
    const dictionary = translations[locale];
    const prefix = dictionary.hero.typewriterPrefix;
    const suffix = dictionary.hero.typewriterSuffix;
    const fullText = prefix + suffix;
    const runId = ++typewriterRunId;
    let charIndex = 0;

    typewriterEl.innerHTML = '';
    cursorEl.style.animation = 'blink 0.8s infinite';

    function step() {
        if (runId !== typewriterRunId) {
            return;
        }

        if (charIndex < fullText.length) {
            const current = fullText.substring(0, charIndex + 1);
            const displayText = current.includes(prefix)
                ? `<span class="highlight">${prefix}</span>${current.substring(prefix.length)}`
                : current;

            typewriterEl.innerHTML = displayText;
            charIndex++;

            const speed = charIndex <= prefix.length ? 100 : 80;
            setTimeout(step, speed);
            return;
        }

        setTimeout(() => {
            if (runId === typewriterRunId) {
                cursorEl.style.animation = 'blink 0.8s infinite';
            }
        }, 500);
    }

    setTimeout(step, delay);
}

function applyLocale(locale, isInitial) {
    const dictionary = translations[locale] || translations['zh-CN'];
    currentLocale = locale;

    try {
        localStorage.setItem('zju-oline-lang', locale);
    } catch (error) {
        // Ignore storage access issues.
    }

    document.documentElement.lang = locale;
    document.title = dictionary.title;

    i18nNodes.forEach(node => {
        const value = getTranslation(dictionary, node.dataset.i18n);
        if (value !== undefined) {
            node.textContent = value;
        }
    });

    langButtons.forEach(button => {
        const isActive = button.dataset.lang === locale;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    renderTypewriter(locale, isInitial ? 800 : 0);
}

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const nextLocale = button.dataset.lang;
        if (nextLocale && nextLocale !== currentLocale) {
            applyLocale(nextLocale, false);
        }
    });
});

applyLocale(currentLocale, true);

// ===== 滚动显示动画 =====
const revealElements = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.skill-bar-fill');
const statNumbers = document.querySelectorAll('.stat-number');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // 技能条动画
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(bar => {
                bar.style.width = bar.dataset.width;
            });

            // 数字动画
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                animateNumber(num);
            });
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// ===== 数字递增动画 =====
function animateNumber(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ===== 导航栏滚动效果 =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.85)';
        nav.style.backdropFilter = 'blur(20px)';
    } else {
        nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
        nav.style.backdropFilter = 'blur(2px)';
    }

    lastScroll = currentScroll;
});

// ===== 鼠标视差效果 =====
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    const hero = document.querySelector('.hero');
    hero.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
});
