import * as THREE from 'three'
import Experience from './Experience.js'
import BookOverlay from './BookOverlay.js'

const HOTSPOTS = [
    {
        key: 'introduction',
        label: 'Introduction',
        position: [0.35, 3.35, -4.35],
        content: `
            <h2>Introduction</h2>
            <p>I'm <strong>Sajud Hamza Elinjulliparambil</strong> — Researcher, Data Engineer, and Developer based in New York.</p>
            <p>Senior engineer with <strong>9+ years</strong> building data-intensive applications. Currently pursuing a <strong>PhD in Computer Science</strong> at Pace University. Author of <strong>16 peer-reviewed publications</strong> and <strong>2 granted UK patents</strong>.</p>
            <p>I've worked at <strong>Netflix, NASDAQ, Fama Technologies, Principal Financial Group,</strong> and <strong>Wirb Copernicus Groups</strong>.</p>
        `
    },
    {
        key: 'qualifications',
        label: 'Qualifications',
        position: [-0.35, 1.25, 1.90],
        content: `
            <h2>Qualifications</h2>
            <h3>Education</h3>
            <ul>
                <li><strong>PhD in Computer Science</strong> (Expected Dec 2026)<br>Pace University, New York</li>
                <li><strong>Master's in Information Systems</strong><br>Pace University, New York</li>
            </ul>
            <h3>Core Skills</h3>
            <div>
                <span class="tag">Python</span>
                <span class="tag">FastAPI</span>
                <span class="tag">Django</span>
                <span class="tag">React</span>
                <span class="tag">Snowflake</span>
                <span class="tag">DBT</span>
                <span class="tag">AWS</span>
                <span class="tag">Docker</span>
                <span class="tag">Kubernetes</span>
                <span class="tag">TensorFlow</span>
                <span class="tag">PyTorch</span>
            </div>
        `
    },
    {
        key: 'patents',
        label: 'Patents',
        position: [2.10, 2.55, -3.65],
        content: `
            <h2>Patents &amp; Innovations</h2>
            <p>2 granted UK patents in financial technology and optical measurement.</p>
            <ul>
                <li><strong>Computing Device for Predicting and Displaying Financial Risk in Real Time</strong> — UK Patent No. 6439245, Granted July 2, 2025</li>
                <li><strong>Stereo Optical Measurement Device for Unknown Scale Object Inspection</strong> — UK Patent No. 6504358, Granted February 20, 2026</li>
            </ul>
        `
    },
    {
        key: 'publications',
        label: 'Publications',
        position: [-3.65, 4.65, -4.00],
        content: `
            <h2>Publications</h2>
            <p>16 peer-reviewed research papers across AI, computer vision, data engineering, and more (2022–2026).</p>
            <ul>
                <li><strong>AI in Intelligent Urban Planning</strong> — IJAIBDCMS, 2026</li>
                <li><strong>AI Driven Urban Planning for Traffic Monitoring</strong> — JISEM, 2025</li>
                <li><strong>AI-Powered Risk Management in Insurance</strong> — JISEM, 2025</li>
                <li><strong>Generalist Vision Models</strong> — IJETCSIT, 2025</li>
                <li><strong>Ultra-Low-Light Imaging Enhancement</strong> — IJERET, 2025</li>
                <li><strong>...and 11 more</strong></li>
            </ul>
        `
    },
    {
        key: 'articles',
        label: 'Articles',
        position: [-3.65, 2.45, -4.15],
        content: `
            <h2>Articles</h2>
            <p>Technical writing and thought leadership published on HackerNoon, BreakThrough, and LinkedIn.</p>
            <ul>
                <li><strong>The Great Digital Gatekeeper</strong> — Social Media Background Checks for Safer Schools (HackerNoon)</li>
                <li><strong>Intelligent Background Verification</strong> — ML &amp; Predictive Analytics (BreakThrough)</li>
                <li><strong>Data Governance Best Practices</strong> — Modern Data Stacks (LinkedIn)</li>
            </ul>
        `
    },
    {
        key: 'judging',
        label: 'Judging',
        position: [3.85, 1.15, -0.50],
        content: `
            <h2>Judging</h2>
            <p>Serving as a judge, reviewer, and evaluator for academic and industry events.</p>
            <ul>
                <li><strong>Conference Reviewer</strong> — Peer review for AI and data engineering conferences.</li>
                <li><strong>Hackathon Judge</strong> — Evaluating innovative projects and startups.</li>
            </ul>
        `
    },
    {
        key: 'media',
        label: 'Media',
        position: [4.15, 2.70, 1.60],
        content: `
            <h2>Media &amp; Press</h2>
            <p>Featured in IBTimes, Benzinga, Tech Times, and Latestly.</p>
            <ul>
                <li><strong>Benzinga</strong> — "A Look At American Safety Through The Work Of Sajud Hamza"</li>
                <li><strong>IBTimes India</strong> — "Making Schools Safe Again"</li>
                <li><strong>Tech Times</strong> — "Cleaning Up The Web With ML &amp; Data Analytics"</li>
                <li><strong>Latestly</strong> — "Revolutionising Workplace Safety"</li>
            </ul>
        `
    },
    {
        key: 'testimonials',
        label: 'Testimonials',
        position: [-3.85, 2.45, 3.65],
        content: `
            <h2>Testimonials</h2>
            <p>What colleagues, mentors, and collaborators have to say.</p>
            <ul>
                <li><em>"An exceptional engineer with deep technical expertise and a passion for innovation."</em></li>
                <li><em>"A brilliant researcher who bridges theory and practice effortlessly."</em></li>
                <li><em>"A collaborative leader who elevates every team he's part of."</em></li>
            </ul>
        `
    },
    {
        key: 'memberships',
        label: 'Memberships',
        position: [-1.90, 1.60, -2.00],
        content: `
            <h2>Memberships</h2>
            <p>Professional organizations and communities.</p>
            <ul>
                <li><strong>Growth Hackers</strong> — Member</li>
                <li><strong>Harvard Business Review Advisory Council</strong> — Member</li>
                <li><strong>International Society of Applied Computing (ISAC)</strong> — Member</li>
                <li><strong>Vation Ventures Technology Practitioner Council</strong> — Member</li>
            </ul>
        `
    }
]

export default class Interactivity
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.targetElement = this.experience.targetElement
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.currentHover = null
        this.isOpen = false
        this.dots = []
        this.canvas = this.targetElement.querySelector('canvas')

        this.panel = document.getElementById('infoPanel')
        this.panelContent = document.getElementById('infoPanelContent')
        this.panelClose = document.getElementById('infoPanelClose')
        this.tooltip = document.getElementById('hotspotTooltip')

        try { this.bookOverlay = new BookOverlay() }
        catch(e) { console.warn('BookOverlay init failed:', e); this.bookOverlay = null }

        this.setHotspots()
        this.setEvents()
        this.initOverlays()
    }

    initOverlays()
    {
        try
        {
            this.introOverlay = document.getElementById('introOverlay')
            this.introClose = document.getElementById('introClose')
            if(this.introClose) this.introClose.addEventListener('click', () => this.closeIntro())

            const introPhoto = document.getElementById('introPhoto')
            if(introPhoto) introPhoto.style.backgroundImage = "url('/assets/profile.jpg')"

            this.newsOverlay = document.getElementById('newsOverlay')
            this.newspaperBody = document.getElementById('newspaperBody')
            this.newsClose = document.getElementById('newsClose')
            if(this.newsClose) this.newsClose.addEventListener('click', () => this.closeNews())
            if(this.newspaperBody) this.buildNewspaper()

            this.judgeOverlay = document.getElementById('judgeOverlay')
            this.judgeList = document.getElementById('judgeList')
            this.judgeScroll = document.querySelector('.judge-overlay__scroll')
            this.judgeCertView = document.getElementById('judgeCertView')
            this.judgeCertFrame = document.getElementById('judgeCertFrame')
            this.judgeClose = document.getElementById('judgeClose')
            this.judgeCertBack = document.getElementById('judgeCertBack')
            if(this.judgeClose) this.judgeClose.addEventListener('click', () => this.closeJudge())
            if(this.judgeCertBack) this.judgeCertBack.addEventListener('click', () => this.closeJudgeCert())
            if(this.judgeList) this.buildJudging()

            this.testOverlay = document.getElementById('testOverlay')
            this.testGrid = document.getElementById('testGrid')
            this.testScroll = document.getElementById('testScroll')
            this.testPdf = document.getElementById('testPdf')
            this.testPdfFrame = document.getElementById('testPdfFrame')
            this.testClose = document.getElementById('testClose')
            this.testPdfBack = document.getElementById('testPdfBack')
            if(this.testClose) this.testClose.addEventListener('click', () => this.closeTest())
            if(this.testPdfBack) this.testPdfBack.addEventListener('click', () => this.closePdfView())
            if(this.testGrid) this.buildTestimonials()

            this.qualOverlay = document.getElementById('qualOverlay')
            this.qualClose = document.getElementById('qualClose')
            if(this.qualClose) this.qualClose.addEventListener('click', () => this.closeQual())

            this.membershipsOverlay = document.getElementById('membershipsOverlay')
            this.membershipsGrid = document.getElementById('membershipsGrid')
            this.membershipsClose = document.getElementById('membershipsClose')
            if(this.membershipsClose) this.membershipsClose.addEventListener('click', () => this.closeMemberships())
            if(this.membershipsGrid) this.buildMemberships()
        }
        catch(e)
        {
            console.warn('Overlay init error (non-fatal):', e)
        }
    }

    setHotspots()
    {
        const dotGeo = new THREE.SphereGeometry(0.08, 16, 16)

        const glowGeo = new THREE.SphereGeometry(0.18, 16, 16)
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.2,
            depthWrite: false,
        })

        const ringGeo = new THREE.RingGeometry(0.2, 0.28, 32)
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide,
            depthWrite: false,
        })

        for(const hotspot of HOTSPOTS)
        {
            const group = new THREE.Group()
            group.position.set(...hotspot.position)

            const dotMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 })
            const dot = new THREE.Mesh(dotGeo, dotMat)
            group.add(dot)

            const glow = new THREE.Mesh(glowGeo, glowMat.clone())
            group.add(glow)

            const ring = new THREE.Mesh(ringGeo, ringMat.clone())
            ring.lookAt(this.camera.instance.position)
            group.add(ring)

            this.scene.add(group)

            this.dots.push({
                key: hotspot.key,
                group,
                dot,
                glow,
                ring,
                data: hotspot,
            })
        }

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({ title: 'hotspots', expanded: true })
            for(const d of this.dots)
            {
                const f = this.debugFolder.addFolder({ title: d.key, expanded: false })
                f.addInput(d.group.position, 'x', { label: 'X', min: -8, max: 8, step: 0.05 })
                f.addInput(d.group.position, 'y', { label: 'Y', min: -2, max: 8, step: 0.05 })
                f.addInput(d.group.position, 'z', { label: 'Z', min: -8, max: 8, step: 0.05 })
            }

            this.debugFolder.addButton({ title: 'Log all positions' }).on('click', () =>
            {
                console.log('--- HOTSPOT POSITIONS ---')
                for(const d of this.dots)
                {
                    const p = d.group.position
                    console.log(`${d.key}: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]`)
                }
            })
        }
    }

    setEvents()
    {
        this._downX = 0
        this._downY = 0
        this._rawMouseX = 0
        this._rawMouseY = 0

        this.onMouseMove = (event) =>
        {
            this.mouse.x = (event.clientX / this.config.width) * 2 - 1
            this.mouse.y = -(event.clientY / this.config.height) * 2 + 1
            this._rawMouseX = event.clientX
            this._rawMouseY = event.clientY
        }

        this.onMouseDown = (event) =>
        {
            if(event.button !== 0) return
            this._downX = event.clientX
            this._downY = event.clientY
        }

        this.onMouseUp = (event) =>
        {
            if(event.button !== 0) return

            const dx = Math.abs(event.clientX - this._downX)
            const dy = Math.abs(event.clientY - this._downY)
            if(dx + dy > 12) return

            this.mouse.x = (event.clientX / this.config.width) * 2 - 1
            this.mouse.y = -(event.clientY / this.config.height) * 2 + 1

            this.raycaster.setFromCamera(this.mouse, this.camera.instance)

            const dotMeshes = this.dots.map(d => d.dot)
            const glowMeshes = this.dots.map(d => d.glow)
            const allMeshes = [...dotMeshes, ...glowMeshes]
            const intersects = this.raycaster.intersectObjects(allMeshes, false)

            if(intersects.length > 0)
            {
                const hit = intersects[0].object
                const entry = this.dots.find(d => d.dot === hit || d.glow === hit)
                if(entry)
                {
                    this.openPanel(entry.key)
                }
            }
        }

        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mouseup', this.onMouseUp)

        if(this.panelClose) this.panelClose.addEventListener('click', () => { this.closePanel() })
        document.addEventListener('keydown', (e) =>
        {
            if(e.key === 'Escape')
            {
                this.closePanel()
                this.closeIntro()
                this.closeQual()
                this.closeNews()
                this.closeJudge()
                this.closeTest()
                this.closeMemberships()
                if(this.bookOverlay) this.bookOverlay.close()
            }
        })
    }

    openPanel(key)
    {
        if(key === 'introduction')
        {
            if(this.introOverlay) this.introOverlay.classList.add('is-open')
            this.isOpen = true
            return
        }

        if(key === 'articles')
        {
            if(this.bookOverlay) this.bookOverlay.open('articles')
            this.isOpen = true
            return
        }

        if(key === 'publications')
        {
            if(this.bookOverlay) this.bookOverlay.open('publications')
            this.isOpen = true
            return
        }

        if(key === 'qualifications')
        {
            if(this.qualOverlay) this.qualOverlay.classList.add('is-open')
            this.isOpen = true
            return
        }

        if(key === 'media')
        {
            this.openNews()
            return
        }

        if(key === 'judging')
        {
            this.openJudge()
            return
        }

        if(key === 'testimonials')
        {
            this.openTest()
            return
        }

        if(key === 'memberships')
        {
            this.openMemberships()
            return
        }

        const entry = this.dots.find(d => d.key === key)
        if(!entry) return

        if(this.panelContent) this.panelContent.innerHTML = entry.data.content
        if(this.panel) this.panel.classList.add('is-open')
        this.isOpen = true
    }

    closePanel()
    {
        if(this.panel) this.panel.classList.remove('is-open')
        if(this.introOverlay) this.introOverlay.classList.remove('is-open')
        this.isOpen = false
    }

    closeIntro()
    {
        if(this.introOverlay) this.introOverlay.classList.remove('is-open')
        this.isOpen = false
    }

    closeQual()
    {
        if(this.qualOverlay) this.qualOverlay.classList.remove('is-open')
        this.isOpen = false
    }

    buildMemberships()
    {
        const memberships = [
            {
                name: 'Growth Hackers',
                role: 'Member',
                image: '/memberships/growth_hackers.png',
                desc: 'Growth Hackers is the world\'s largest community of growth professionals — sharing strategies, tactics, and insights to accelerate business growth.',
            },
            {
                name: 'Harvard Business Review Advisory Council',
                role: 'Member',
                image: '/memberships/harvard_bussiness_review.jpg',
                desc: 'The HBR Advisory Council connects leaders and experts who provide insights and feedback on the future of business management and strategy.',
            },
            {
                name: 'International Society of Applied Computing (ISAC)',
                role: 'Member',
                image: '/memberships/ISAC.png',
                desc: 'ISAC promotes the advancement of computing applications in diverse domains including AI, data science, and software engineering.',
            },
            {
                name: 'Vation Ventures Technology Practitioner Council',
                role: 'Member',
                image: '/memberships/vation ventures.jpg',
                desc: 'Vation Ventures connects technology practitioners to evaluate, advise on, and shape emerging enterprise technologies.',
            },
        ]

        this.membershipsGrid.innerHTML = memberships.map(m => `
            <div class="membership-card">
                <div class="membership-card__img" style="background-image:url('${m.image}')"></div>
                <div class="membership-card__body">
                    <h3>${m.name}</h3>
                    <div class="membership-role">${m.role}</div>
                    <p>${m.desc}</p>
                </div>
            </div>
        `).join('')
    }

    openMemberships()
    {
        if(this.membershipsOverlay) this.membershipsOverlay.classList.add('is-open')
        this.isOpen = true
    }

    closeMemberships()
    {
        if(this.membershipsOverlay) this.membershipsOverlay.classList.remove('is-open')
        this.isOpen = false
    }

    buildNewspaper()
    {
        const media = [
            {
                headline: 'A Look At American Safety Through The Work Of Sajud Hamza Elinjulliparambil',
                byline: 'Benzinga — Aug 9, 2024',
                image: '',
                body: 'How technology keeps American people safe from fraud and the role of Data and AI in it.',
                link: 'https://www.benzinga.com/partner/general/24/08/40289096/a-look-at-american-safety-through-the-work-of-sajud-hamza-elinjulliparambi',
                featured: true,
            },
            {
                headline: 'Sajud Hamza Elinjulliparambil Making Schools Safe Again',
                byline: 'IBTimes India — Feb 14, 2024',
                image: '',
                body: '"Data is the most reliable source of predicting risk. We have created social media screening platforms that can screen potential employees and now we\'re targeting schools, because that\'s really where our most vulnerable are positioned."',
                link: 'https://www.ibtimes.co.in/sajud-hamza-elinjulliparambil-making-schools-safe-again-866089',
                featured: false,
            },
            {
                headline: 'Cleaning Up The Web With Machine Learning And Data Analytics',
                byline: 'Tech Times — Aug 3, 2023',
                image: '',
                body: 'A deep dive into how Data Analytics is reshaping the Social Media Screening landscape.',
                link: 'https://www.techtimes.com/articles/294646/20230803/cleaning-up-web-machine-learning-data-analytics.htm',
                featured: false,
            },
            {
                headline: 'Revolutionising Workplace Safety: The Hero of Social Media Background Screening',
                byline: 'Latestly — Sep 25, 2023',
                image: '',
                body: 'An article on how Social Media Screening is helping make workplaces safe.',
                link: 'https://www.latestly.com/technology/revolutionising-workplace-safety-the-hero-of-social-media-background-screening-5438174.html',
                featured: false,
            },
        ]

        this.newspaperBody.innerHTML = media.map(m =>
        {
            const cls = m.featured ? 'news-article news-article--featured' : 'news-article'
            const img = m.image ? `<div class="news-article__img" style="background-image:url('${m.image}')"></div>` : ''
            const link = m.link ? `<a class="news-article__link" href="${m.link}" target="_blank">Read Full Story &rarr;</a>` : ''
            return `
                <div class="${cls}">
                    <div class="news-article__headline">${m.headline}</div>
                    <div class="news-article__byline">${m.byline}</div>
                    ${img}
                    <div class="news-article__body"><p>${m.body}</p></div>
                    ${link}
                </div>
            `
        }).join('')
    }

    openNews()
    {
        if(this.newsOverlay) this.newsOverlay.classList.add('is-open')
        this.isOpen = true
    }

    closeNews()
    {
        if(this.newsOverlay) this.newsOverlay.classList.remove('is-open')
        this.isOpen = false
    }

    buildJudging()
    {
        const events = [
            {
                title: 'Panel Judge - Tech Innovations',
                type: 'judge',
                date: 'Mar 2022',
                org: 'QS Reimagine Awards',
                desc: 'Judge Panel for QS Reimagine Awards 2023, judging more than 40 entries about novel Unicorn start-up ideas.',
                cert: '',
                panelLink: 'https://qsrea.evessiocloud.com/Awards2024/en/node/judgeprofile-sajud-e',
            },
            {
                title: 'Panel Judge - Business & Tech',
                type: 'judge',
                date: 'Oct 2023',
                org: 'Titan Awards',
                desc: 'Panel Judge for Business Awards 2023, judging over 50 entries about innovative tech business ideas.',
                cert: '/membercert/Sajud Hamza Elinjulliparambil_Endorsement [TBA].pdf',
                panelLink: 'https://thetitanawards.com/our-judge.php',
            },
            {
                title: 'Panel Judge - Tech and AI',
                type: 'judge',
                date: 'Apr 2023',
                org: 'Globee Awards',
                desc: 'Panel Judge for Globee Awards, judging over 30 entries for advanced AI ideas across 3 stages.',
                cert: '',
                panelLink: '',
            },
            {
                title: 'Panel Judge - Computer Science',
                type: 'judge',
                date: 'Mar 2024',
                org: 'The Global Undergraduate Awards',
                desc: 'Guiding aspiring undergraduate students in developing prototypes and judging creative ideas to shape future engineers.',
                cert: '/membercert/inventionchallenge.pdf',
                panelLink: '',
            },
            {
                title: 'Mentor & Judge - Undergraduate CS',
                type: 'judge',
                date: 'Mar 2022',
                org: 'Future Engineers',
                desc: 'Guiding aspiring undergraduate students in developing toy prototypes and judging their creative ideas.',
                cert: '/membercert/inventionchallenge.pdf',
                panelLink: '',
            },
            {
                title: 'Panel Judge - Business Intelligence',
                type: 'judge',
                date: 'Mar 2024 | June 2024 | Aug 2024 | Feb 2025',
                org: 'Business Intelligence Awards',
                desc: 'Judge Panel for Business Intelligence Awards across multiple sessions, judging more than 40 entries about novel BI ideas.',
                cert: '/membercert/judge-certificate-stratus-2023.png',
                panelLink: 'https://www.bintelligence.com/judge/sajud-p',
            },
            {
                title: 'Panel Judge - Design Awards',
                type: 'judge',
                date: 'Mar 2022',
                org: 'NY Product Design Awards',
                desc: 'Judge Panel for NY Product Design Awards, judging more than 20 entries about product designs.',
                cert: '',
                panelLink: 'https://nydesignawards.com/our-judge.php',
            },
            {
                title: 'Peer Review - IEM-ICDC 2025',
                type: 'review',
                date: 'Apr 2025',
                org: 'International Conference on Computational Intelligence, Data Science & Cloud Computing',
                desc: 'Peer reviewed multiple research papers for the 3rd International Conference on Computational Intelligence, Data Science & Cloud Computing by IEM, Kolkata.',
                cert: '/membercert/ICDC2025.jpeg',
                panelLink: '',
            },
            {
                title: 'Peer Review - ICDSA 2025',
                type: 'review',
                date: 'Jul 2025',
                org: 'International Conference on Data Science & Applications',
                desc: 'Peer reviewed multiple research papers for the 6th International Conference on Data Science & Applications by MNIT Jaipur, India.',
                cert: '/membercert/ICDSA 2025 TPC Certificate-346.pdf',
                panelLink: '',
            },
        ]

        this.judgingEvents = events

        const badgeClass = { judge: 'judge', panel: 'panel', review: 'review' }
        const badgeLabel = { judge: 'Judge', panel: 'Panelist', review: 'Reviewer' }

        this.judgeList.innerHTML = events.map((ev, i) =>
        {
            let actions = ''
            if(ev.cert)
                actions += `<button class="judge-card__btn" data-cert="${ev.cert}">📜 View Certificate</button>`
            if(ev.panelLink)
                actions += `<a class="judge-card__btn" href="${ev.panelLink}" target="_blank">🔗 Panel Link</a>`

            return `
                <div class="judge-card">
                    <div class="judge-card__header">
                        <h3>${ev.title}</h3>
                        <span class="judge-card__badge judge-card__badge--${badgeClass[ev.type]}">${badgeLabel[ev.type]}</span>
                    </div>
                    <div class="judge-card__meta">${ev.org} · ${ev.date}</div>
                    <div class="judge-card__desc">${ev.desc}</div>
                    <div class="judge-card__actions">${actions}</div>
                </div>
            `
        }).join('')

        if(this.judgeList) this.judgeList.addEventListener('click', (e) =>
        {
            const btn = e.target.closest('[data-cert]')
            if(!btn) return
            const cert = btn.dataset.cert
            if(cert && this.judgeCertFrame && this.judgeCertView && this.judgeScroll)
            {
                this.judgeCertFrame.src = cert
                this.judgeCertView.classList.add('is-open')
                this.judgeScroll.style.display = 'none'
            }
        })
    }

    animateCounters()
    {
        if(!this.judgingEvents) return
        const judges = this.judgingEvents.filter(e => e.type === 'judge').length
        const certs = this.judgingEvents.filter(e => e.cert).length
        const panels = this.judgingEvents.filter(e => e.type === 'panel').length

        const animate = (el, target) =>
        {
            if(!el) return
            let current = 0
            const step = Math.max(1, Math.ceil(target / 30))
            const interval = setInterval(() =>
            {
                current += step
                if(current >= target) { current = target; clearInterval(interval) }
                el.textContent = current
            }, 40)
        }

        animate(document.getElementById('statEvents'), judges + this.judgingEvents.filter(e => e.type === 'review').length)
        animate(document.getElementById('statCerts'), certs)
        animate(document.getElementById('statPanels'), panels)
    }

    openJudge()
    {
        if(this.judgeCertView) this.judgeCertView.classList.remove('is-open')
        if(this.judgeScroll) this.judgeScroll.style.display = ''
        if(this.judgeCertFrame) this.judgeCertFrame.src = ''
        if(this.judgeOverlay) this.judgeOverlay.classList.add('is-open')
        this.isOpen = true
        if(this.judgingEvents) this.animateCounters()
    }

    closeJudge()
    {
        if(this.judgeOverlay) this.judgeOverlay.classList.remove('is-open')
        if(this.judgeCertView) this.judgeCertView.classList.remove('is-open')
        if(this.judgeCertFrame) this.judgeCertFrame.src = ''
        if(this.judgeScroll) this.judgeScroll.style.display = ''
        this.isOpen = false
    }

    closeJudgeCert()
    {
        if(this.judgeCertView) this.judgeCertView.classList.remove('is-open')
        if(this.judgeCertFrame) this.judgeCertFrame.src = ''
        if(this.judgeScroll) this.judgeScroll.style.display = ''
    }

    buildTestimonials()
    {
        const testimonials = [
            {
                name: 'Bharat Bhate',
                role: 'Founder/President, Consultadd Inc',
                photo: '/Testimonial/Bharat.png',
                quote: 'Mr. Elinjulliparambil is a distinguished expert who plays a crucial role at ConsultAdd. As Senior Data Engineer, his technical skills and innovative approach were instrumental in shaping our client\'s success.',
                pdf: '/Testimonial/pdfs/LOR Bharat Bhate Sajud.pdf',
            },
            {
                name: 'Brendten Eickstaedt',
                role: 'CTO, Fama Technologies',
                photo: '/Testimonial/Brendten Eickstaedt.jpg',
                quote: 'He played a crucial role in developing Fama\'s flagship product — an advanced AI tool designed to screen employment candidates, sifting through data from over 10,000 online public sources.',
                pdf: '/Testimonial/pdfs/Brendten Recommendation.pdf',
            },
            {
                name: 'Amir Mirza',
                role: 'Monitoring Services Lead, Blenheim Chalcot',
                photo: '/Testimonial/Amir Mirza.jpg',
                quote: 'His role was of paramount importance, managing high-stakes clients including the City of London Police, analyzing complex system data to ensure seamless operation of essential services.',
                pdf: '/Testimonial/pdfs/Amir Mirza - Sajud Hamza.pdf',
            },
            {
                name: 'Okpara Uche',
                role: 'Principal AI Architect / ML Engineer',
                photo: '/Testimonial/Okpara Uche.jpg',
                quote: 'His deep understanding of both theoretical concepts and practical implementation was key to our success. He is a dedicated and brilliant engineer who consistently delivers high-quality work.',
                pdf: '/assets/testimonials/pdfs/jane-smith-testimonial.pdf',
            },
        ]

        this.testGrid.innerHTML = testimonials.map(t => `
            <div class="test-card" data-pdf="${t.pdf}">
                <div class="test-card__photo" style="background-image:url('${t.photo}')"></div>
                <div class="test-card__name">${t.name}</div>
                <div class="test-card__role">${t.role}</div>
                <div class="test-card__quote">"${t.quote}"</div>
            </div>
        `).join('')

        if(this.testGrid) this.testGrid.addEventListener('click', (e) =>
        {
            const card = e.target.closest('.test-card')
            if(!card) return
            const pdf = card.dataset.pdf
            if(pdf && this.testPdfFrame && this.testPdf && this.testScroll)
            {
                this.testPdfFrame.src = pdf
                this.testPdf.classList.add('is-open')
                this.testScroll.style.display = 'none'
            }
        })
    }

    openTest()
    {
        if(this.testPdf) this.testPdf.classList.remove('is-open')
        if(this.testScroll) this.testScroll.style.display = ''
        if(this.testPdfFrame) this.testPdfFrame.src = ''
        if(this.testOverlay) this.testOverlay.classList.add('is-open')
        this.isOpen = true
    }

    closeTest()
    {
        if(this.testOverlay) this.testOverlay.classList.remove('is-open')
        if(this.testPdf) this.testPdf.classList.remove('is-open')
        if(this.testPdfFrame) this.testPdfFrame.src = ''
        if(this.testScroll) this.testScroll.style.display = ''
        this.isOpen = false
    }

    closePdfView()
    {
        if(this.testPdf) this.testPdf.classList.remove('is-open')
        if(this.testPdfFrame) this.testPdfFrame.src = ''
        if(this.testScroll) this.testScroll.style.display = ''
    }

    update()
    {
        const elapsed = this.time.elapsed * 0.001

        for(let i = 0; i < this.dots.length; i++)
        {
            const d = this.dots[i]
            const phase = i * 1.2

            // Pulse the glow
            const pulse = 0.15 + Math.sin(elapsed * 2.5 + phase) * 0.1
            d.glow.material.opacity = pulse
            const s = 1.0 + Math.sin(elapsed * 2.5 + phase) * 0.25
            d.glow.scale.setScalar(s)

            // Expanding ring ping every ~3 seconds
            const ringCycle = ((elapsed + phase) % 3.0) / 3.0
            d.ring.scale.setScalar(1.0 + ringCycle * 3.0)
            d.ring.material.opacity = (1.0 - ringCycle) * 0.35

            // Face the ring toward the camera
            d.ring.lookAt(this.camera.instance.position)
        }

        // Hover cursor + tooltip via screen-space proximity
        const mx = this._rawMouseX
        const my = this._rawMouseY
        let closestEntry = null
        let closestDist = 40
        let closestSX = 0
        let closestSY = 0

        for(const dd of this.dots)
        {
            const projected = dd.group.position.clone().project(this.camera.instance)
            if(projected.z < -1 || projected.z > 1) continue
            const sx = (projected.x * 0.5 + 0.5) * this.config.width
            const sy = (-projected.y * 0.5 + 0.5) * this.config.height
            const dist = Math.hypot(sx - mx, sy - my)
            if(dist < closestDist)
            {
                closestDist = dist
                closestEntry = dd
                closestSX = sx
                closestSY = sy
            }
        }

        if(closestEntry)
        {
            this.targetElement.style.cursor = 'pointer'
            this.currentHover = closestEntry

            if(this.tooltip)
            {
                this.tooltip.textContent = closestEntry.data.label
                this.tooltip.style.left = closestSX + 'px'
                this.tooltip.style.top = (closestSY - 40) + 'px'
                this.tooltip.classList.add('is-visible')
            }
        }
        else
        {
            this.targetElement.style.cursor = 'grab'
            if(this.currentHover)
            {
                if(this.tooltip) this.tooltip.classList.remove('is-visible')
            }
            this.currentHover = null
        }
    }
}
