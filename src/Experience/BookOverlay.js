const ARTICLES = [
    {
        title: 'The Great Digital Gatekeeper: Social Media Background Checks for Safer Schools',
        summary: 'Discussed the importance of Social Media Screening in today\'s world with the help of Data Analytics. Over 90% of people under 18 actively use social media — AI-powered background checks could monitor patterns of behavior that raise safety concerns.',
        tags: ['School Safety', 'AI', 'Social Media', 'Background Checks'],
        link: 'https://hackernoon.com/the-great-digital-gatekeeper-social-media-background-checks-for-safer-schools',
    },
    {
        title: 'Intelligent Background Verification: The Potential of Machine Learning and Predictive Analytics',
        summary: 'A comprehensive overview of how Machine Learning and predictive analytics are transforming the background checking process for employers.',
        tags: ['Machine Learning', 'Predictive Analytics', 'Background Verification'],
        link: 'https://breakthrough.neliti.com/background-verification-machine-learning-predictive-analytics/',
    },
    {
        title: 'Data Governance Best Practices for Modern Data Stacks',
        summary: 'Outlined key strategies for implementing effective data governance in cloud-native data architectures.',
        tags: ['Data Governance', 'Cloud', 'Data Stacks'],
        link: 'https://linkedin.com/in/yourprofile/articles/data-governance',
    },
]

const PUBLICATIONS = [
    {
        title: 'The Role of Artificial Intelligence in Intelligent Urban Planning: From Data-Driven Insights to Sustainable City Systems',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of AI, BigData, Computational and Management Studies',
        year: '2026',
        summary: 'Explores how AI and data-driven approaches are transforming urban planning for sustainable city systems.',
        tags: ['AI', 'Urban Planning', 'Sustainability'],
        link: 'https://ijaibdcms.org/index.php/ijaibdcms/article/view/441',
    },
    {
        title: 'AI Driven Urban Planning for Real Time Traffic Monitoring Framework Using OpenCV and YOLO',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'Journal of Information Systems Engineering and Management',
        year: '2025',
        summary: 'Methods for building highly scalable real-time traffic monitoring with AI for urban planning.',
        tags: ['AI', 'YOLO', 'OpenCV', 'Traffic Monitoring'],
        link: 'https://jisem-journal.com/index.php/journal/article/view/5765',
    },
    {
        title: 'The Crunchy Part Entails the Innovations Offered In Big Data Analytics and Software Engineering of Smart Decision-Making Systems',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Engineering and Computer Science',
        year: '2025',
        summary: 'Examines how big data analytics and software engineering solutions are restructuring decision-making in industries.',
        tags: ['Big Data', 'Software Engineering', 'Decision Systems'],
        link: 'https://ijecs.in/index.php/ijecs/article/view/5341',
    },
    {
        title: 'AI-Powered Risk Management in Insurance: Challenges and Best Practices',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'Journal of Information Systems Engineering and Management',
        year: '2025',
        summary: 'Presents a novel AI-Powered Risk Management framework for the insurance industry.',
        tags: ['AI', 'Risk Management', 'Insurance'],
        link: 'https://jisem-journal.com/index.php/journal/article/view/7055',
    },
    {
        title: 'The Impact of Large Language Models on Education and Workforce Skills',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Engineering Technology Research & Management',
        year: '2025',
        summary: 'How large language models are transforming learning, teaching, and work — as tutors, writing assistants, coding partners, and data analysis aids.',
        tags: ['LLMs', 'Education', 'Workforce'],
        link: 'https://ijetrm.com/issues/files/Aug-2025-19-1755572302-AUG20.pdf',
    },
    {
        title: 'The Role of Generative AI in Revolutionizing Creative Industries',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Engineering Technology Research & Management',
        year: '2025',
        summary: 'How generative AI is changing creative industries across art, music, design, film, gaming, advertising, and publishing.',
        tags: ['Generative AI', 'Creative Industries'],
        link: 'https://ijetrm.com/issues/files/Aug-2025-19-1755572481-AUG21.pdf',
    },
    {
        title: 'Ethical Challenges in Deploying AI for Healthcare Diagnostics',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Engineering Technology Research & Management',
        year: '2025',
        summary: 'Examines how AI is transforming diagnostic offerings in healthcare, creating solutions in disease detection, clinical decision support, and predictive analytics.',
        tags: ['AI Ethics', 'Healthcare', 'Diagnostics'],
        link: 'https://ijetrm.com/issues/files/Aug-2025-19-1755572691-AUG22.pdf',
    },
    {
        title: 'Public-Private Partnerships in Cybersecurity: A Strategic Approach to National Threat Management',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'Journal of Electrical Systems',
        year: '2025',
        summary: 'How public-private partnerships bridge capability, intelligence, and response gaps for national cybersecurity.',
        tags: ['Cybersecurity', 'Public Policy', 'PPP'],
        link: 'https://journal.esrgroups.org/jes/article/view/9148',
    },
    {
        title: 'Generalist Vision Models for Any-to-Any Image-to-Video Understanding',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Emerging Trends in Computer Science and Information Technology (IJETCSIT), Vol. 6, Issue 3, pp. 112–120',
        year: '2025',
        summary: 'Examines multimodal foundation models handling images, videos, audio, and language. Covers Unified-IO 2, UnIVAL, PaLi-3, and 4M-21.',
        tags: ['Computer Vision', 'Multimodal AI', 'Foundation Models'],
        link: 'https://www.ijetcsit.org/index.php/ijetcsit/article/view/528',
    },
    {
        title: 'Ultra-Low-Light Imaging Enhancement Using Quantum-Inspired Neural Networks',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Emerging Research in Engineering and Technology',
        year: '2025',
        summary: 'Addresses ultra-low-light imaging for biomedical microscopy, astronomical observation, surveillance, and remote sensing where photon-limited conditions impair image quality.',
        tags: ['Quantum Computing', 'Image Enhancement', 'Neural Networks'],
        link: 'https://ijeret.org/index.php/ijeret/article/view/412',
    },
    {
        title: 'Multiview Diffusion Models for High-Resolution Image Synthesis',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Emerging Research in Engineering and Technology (IJERET), Vol. 5, No. 3, pp. 118–127',
        year: '2024',
        summary: 'Comprehensive review of multiview diffusion models for generating coherent images from different viewpoints. Applications in 3D reconstruction, VR, medical imaging, and autonomous systems.',
        tags: ['Diffusion Models', '3D Vision', 'Image Synthesis'],
        link: 'https://ijeret.org/index.php/ijeret/article/view/399',
    },
    {
        title: 'Vision-Based Human Action Recognition Using Skeleton Graph Neural Networks',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Artificial Intelligence, Data Science, and Machine Learning (IJAIDSML), Vol. 5, Issue 3, pp. 148–156',
        year: '2024',
        summary: 'Systematized review of skeleton-based human action recognition using Graph Neural Networks with applications in surveillance, healthcare, and robotics.',
        tags: ['Action Recognition', 'Graph Neural Networks', 'Computer Vision'],
        link: 'http://ijaidsml.org/index.php/ijaidsml/article/view/380',
    },
    {
        title: 'Robust Object Detection under Extreme Weather Using Physics-Aware Deep Learning',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'American International Journal of Computer Science and Technology (AIJCST), Vol. 6, No. 2, pp. 22–33',
        year: '2024',
        summary: 'Physics-aware approaches incorporating atmospheric scattering, rain streak formation, and low-light noise models for robust object detection.',
        tags: ['Object Detection', 'Deep Learning', 'Autonomous Driving'],
        link: 'https://aijcst.org/index.php/aijcst/article/view/145',
    },
    {
        title: 'Real-Time Instance Segmentation Using Lightweight CNN-Transformer Hybrids',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Emerging Trends in Computer Science and Information Technology (IJETCSIT), Vol. 4, Issue 4, pp. 159–167',
        year: '2023',
        summary: 'Examines instance segmentation combining CNNs and Transformers for resource-constrained platforms and autonomous systems.',
        tags: ['Instance Segmentation', 'CNN-Transformer', 'Edge Computing'],
        link: 'https://www.ijetcsit.org/index.php/ijetcsit/article/view/527',
    },
    {
        title: 'Vision Transformers (ViT) for Small-Scale Image Classification with Token Reduction',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of AI, BigData, Computational and Management Studies',
        year: '2022',
        summary: 'Explores how Vision Transformers exploit self-attention to capture long-range dependencies for image classification, outperforming traditional CNNs.',
        tags: ['Vision Transformers', 'Image Classification', 'Token Reduction'],
        link: 'https://ijaibdcms.org/index.php/ijaibdcms/article/view/344',
    },
    {
        title: '3D Reconstruction from Monocular Videos Using Neural Radiance Fields (NeRF)',
        authors: 'Sajud Hamza Elinjulliparambil',
        venue: 'International Journal of Emerging Research in Engineering and Technology (IJERET), Vol. 3, No. 4, pp. 115–127',
        year: '2022',
        summary: 'Reviews NeRF for monocular video 3D reconstruction with applications in AR/VR, robotics, cultural heritage, and digital content creation.',
        tags: ['NeRF', '3D Reconstruction', 'Neural Rendering'],
        link: 'https://ijeret.org/index.php/ijeret/article/view/398',
    },
]

function itemHTML(item, idx, type)
{
    const tags = item.tags.map(t => `<span class="article-tag">${t}</span>`).join('')

    if(type === 'publications')
    {
        return `
            <h2>${item.title}</h2>
            <h3>Publication ${idx + 1}</h3>
            <p style="font-style:italic;color:#6b5c4a;margin-bottom:4px">${item.authors}</p>
            <p style="color:#8b7355;font-size:13px;margin-bottom:12px">${item.venue}, ${item.year}</p>
            <p>${item.summary}</p>
            <div style="margin:14px 0">${tags}</div>
            <p><a href="${item.link}" target="_blank">View publication &rarr;</a></p>
        `
    }

    return `
        <h2>${item.title}</h2>
        <h3>Article ${idx + 1}</h3>
        <p>${item.summary}</p>
        <div style="margin:14px 0">${tags}</div>
        <p><a href="${item.link}" target="_blank">Read full article &rarr;</a></p>
    `
}

function tocHTML(items, type)
{
    const label = type === 'publications' ? 'Publications' : 'Articles'
    const rows = items.map((a, i) =>
    {
        const sub = type === 'publications'
            ? `<span style="font-size:13px;color:#8b7355">${a.venue}, ${a.year}</span>`
            : `<span style="font-size:13px;color:#8b7355">${a.tags.join(' · ')}</span>`
        return `<li style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.06)">
            <strong style="color:#1a0f08">${i + 1}. ${a.title}</strong><br>${sub}
        </li>`
    }).join('')

    return `
        <h2>${label}</h2>
        <h3>Table of Contents</h3>
        <ul style="list-style:none;padding:0;margin-top:10px">${rows}</ul>
    `
}

export default class BookOverlay
{
    constructor()
    {
        this.el = {
            overlay:  document.getElementById('bookOverlay'),
            backdrop: document.getElementById('bookBackdrop'),
            book:     document.getElementById('book'),
            leftC:    document.getElementById('pageStaticLeftContent'),
            rightC:   document.getElementById('pageStaticRightContent'),
            leftN:    document.getElementById('pageStaticLeftNum'),
            rightN:   document.getElementById('pageStaticRightNum'),
            flipper:  document.getElementById('flipper'),
            front:    document.getElementById('flipperFront'),
            back:     document.getElementById('flipperBack'),
            prev:     document.getElementById('bookPrev'),
            next:     document.getElementById('bookNext'),
            close:    document.getElementById('bookClose'),
            indicator:document.getElementById('bookIndicator'),
        }

        this.spread = 0
        this.animating = false
        this.isOpen = false
        this.items = []
        this.type = 'articles'
        this.totalSpreads = 1

        if(this.el.prev) this.el.prev.addEventListener('click', () => this.prev())
        if(this.el.next) this.el.next.addEventListener('click', () => this.next())
        if(this.el.close) this.el.close.addEventListener('click', () => this.close())
        if(this.el.backdrop) this.el.backdrop.addEventListener('click', () => this.close())
        document.addEventListener('keydown', (e) =>
        {
            if(!this.isOpen) return
            if(e.key === 'Escape') this.close()
            if(e.key === 'ArrowRight' || e.key === 'ArrowDown') this.next()
            if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.prev()
        })
    }

    open(type)
    {
        this.type = type || 'articles'
        this.items = this.type === 'publications' ? PUBLICATIONS : ARTICLES
        this.totalSpreads = Math.ceil(this.items.length / 2) + 1
        this.spread = 0
        this.isOpen = true

        this.el.book.className = 'book book--' + this.type
        this.el.overlay.classList.add('is-open')
        this.render()
    }

    close()
    {
        this.isOpen = false
        this.el.overlay.classList.remove('is-open')
    }

    leftContent(spread)
    {
        if(spread === 0) return tocHTML(this.items, this.type)
        const idx = spread * 2 - 1
        return idx < this.items.length
            ? itemHTML(this.items[idx], idx, this.type)
            : '<p style="color:#8b7355;text-align:center;margin-top:80px"><em>— End —</em></p>'
    }

    rightContent(spread)
    {
        if(spread === 0) return this.items[0] ? itemHTML(this.items[0], 0, this.type) : ''
        const idx = spread * 2
        return idx < this.items.length
            ? itemHTML(this.items[idx], idx, this.type)
            : '<p style="color:#8b7355;text-align:center;margin-top:80px"><em>More coming soon…</em></p>'
    }

    leftNum(spread)
    {
        if(spread === 0) return ''
        const idx = spread * 2 - 1
        return idx < this.items.length ? String(idx + 1) : ''
    }

    rightNum(spread)
    {
        const idx = spread === 0 ? 0 : spread * 2
        return idx < this.items.length ? String(idx + 1) : ''
    }

    render()
    {
        this.el.leftC.innerHTML  = this.leftContent(this.spread)
        this.el.rightC.innerHTML = this.rightContent(this.spread)
        this.el.leftN.textContent  = this.leftNum(this.spread)
        this.el.rightN.textContent = this.rightNum(this.spread)
        this.el.prev.disabled = this.spread === 0
        this.el.next.disabled = this.spread >= this.totalSpreads - 1
        this.el.indicator.textContent = `${this.spread + 1} / ${this.totalSpreads}`
    }

    next()
    {
        if(this.animating || this.spread >= this.totalSpreads - 1) return
        this.animating = true
        const nextSpread = this.spread + 1

        this.el.front.innerHTML = this.rightContent(this.spread)
        this.el.back.innerHTML = this.leftContent(nextSpread)
        this.el.rightC.innerHTML = this.rightContent(nextSpread)

        this.el.flipper.classList.remove('go-forward', 'go-backward')
        this.el.flipper.style.display = 'none'
        void this.el.flipper.offsetHeight
        this.el.flipper.classList.add('go-forward')

        const done = () =>
        {
            this.el.flipper.removeEventListener('animationend', done)
            this.el.flipper.classList.remove('go-forward')
            this.el.flipper.style.display = 'none'
            this.spread = nextSpread
            this.render()
            this.animating = false
        }
        this.el.flipper.addEventListener('animationend', done)
    }

    prev()
    {
        if(this.animating || this.spread <= 0) return
        this.animating = true
        const prevSpread = this.spread - 1

        this.el.front.innerHTML = this.rightContent(prevSpread)
        this.el.back.innerHTML = this.leftContent(this.spread)
        this.el.leftC.innerHTML = this.leftContent(prevSpread)

        this.el.flipper.classList.remove('go-forward', 'go-backward')
        this.el.flipper.style.display = 'none'
        void this.el.flipper.offsetHeight
        this.el.flipper.classList.add('go-backward')

        const done = () =>
        {
            this.el.flipper.removeEventListener('animationend', done)
            this.el.flipper.classList.remove('go-backward')
            this.el.flipper.style.display = 'none'
            this.spread = prevSpread
            this.render()
            this.animating = false
        }
        this.el.flipper.addEventListener('animationend', done)
    }
}
