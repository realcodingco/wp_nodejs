const adminEmail = 'help@realcoding.co';
const homepage = {
    header : {
        menuData : [
            {
                state: true,
                title: 'Theme',
                link: '#theme'
            },
            {
                state: true,
                title: 'Plugin',
                link: '#plugin'
            },
            {
                state: true,
                title: 'Pricing',
                link: '#price'
            },
            {
                state: true,
                title: 'FAQ',
                link: '#faq'
            }
        ]
    },
    faqItems : [
        {
            que : 'What is Business-Site-Builder Pro?',
            ans : 'Business-Site-Builder is a plugin for providing and editing themes for creating a complete corporate website that can be used within WordPress.'//'Business-Site-Builder는 워드프레스 내에서 사용할 수 있는 완성형 기업 홈페이지 제작을 위한 테마 제공 및 편집을 위한 플러그인 입니다.'
        },
        {
            que: 'Is the default theme free?',//'기본 테마는 무료인가요?',
            ans: 'Yes. The default theme is free.<br>However, after activating the free theme, you can preview the finished homepage, but you cannot edit it.'//'네. 기본 테마는 무료입니다. \n다만, 무료로 제공된 테마를 활성화 후, 완성된 홈페이지를 미리 확인할 수 있으며, 편집은 불가능합니다.'
        },
        {
            que: 'How do I install a theme?',//'테마는 어떻게 설치하나요?',
            ans: 'You can download the theme archive from this page and install it directly to your theme folder path, or you can install the theme after installing and activating the business-site-builder plugin.'//'본 페이지를 통해 테마 압축파일을 다운로드 받아 테마 폴더 경로에 직접 설치하시거나, business-site-builder 플러그인을 설치 및 활성화 후 테마를 설치할 수 있습니다.'
        },
        {
            que : 'Can I use a WordPress page?',//'워드프레스 페이지를 사용할 수 있나요?',
            ans : 'Yes. you can.<br>Simply subscribe to PRO and use the ID of the WordPress page you want to use in the relevant menu.'//'네. 가능합니다.\n PRO를 구독 후, 사용하고자 하는 워드프레스 페이지의 id를 관련 메뉴에서 사용하면 됩니다.'
        },
        {
            que : 'How much can I edit with a plugin subscription?',//'플러그인 구독으로 편집가능한 범위는 어느 정도인가요?',
            ans : 'You can modify and edit the main color of the homepage, the basic menu organization, and the content of the detail pages to your want.'//'홈페이지 메인 컬러, 기본적인 메뉴 구성, 세부 페이지의 내용을 원하는대로 수정하고 편집할 수 있습니다.'
        },
        {
            que : 'I want a refund. How do I do that?',//'환불이 가능한가요?',
            ans : 'Yes. Anytime within 7 days. <br>In [My account] - [Subscription], click the refund button for the item in the payment history list.<br>There are no refunds after 7 days, so keep that in mind.'//'네. 가능합니다.\n 7일 이내에 언제든지 환불요청을 할 수 있습니다. 환불 문의는 '
        },
        {
            que: 'How do I contact you about a theme or plugin?',
            ans: `Send us an email with what you\'d like to talk about We\'ll get back to you within 10 business days.<br><i class="fa-regular fa-envelope"></i> ${adminEmail}`
        },
        {
            que: 'I want to commission a theme template, how do I do that?',
            ans: `For requests to customize a theme template, please email ${adminEmail}.`
        },
        {
            que: 'What do domain settings mean?',
            ans: 'After you pay for your plugin subscription, you can set the number of domains for your chosen plan.<br>If it is not a saved domain, the theme and plugin will not work.'
        },
        // {
        //     que: '',
        //     ans: ''
        // },
    ],
    themes: {
        title : 'Starting from a created template<br>Simply populate your Website',
        theme : [
            {
                name : 'business',
                img : './style/screenshot.png',
                feature: [
                    {
                        title: 'Rolling Main Banner',//'롤링 메인배너',
                        desc: 'Showcase your corporate message with a rolling main banner that flows from side to side, and you can add as many banners as you like.'//'좌우로 흐르는 롤링 메인 배너로 기업 메시지를 노출시킬 수 있으며, 배너 수는 원하는 만큼 추가할 수 있습니다.'
                    },
                    {
                        title: '6 menu pages',//'6개 메뉴 페이지',
                        desc: 'There are six built-in menus to create each page. You can disable any menus you don\'t want, or add new ones.'//'기본 제공되는 메뉴는 6개로 각 페이지를 생성합니다. 원하지 않는 메뉴는 사용하지 않거나, 새로운 메뉴를 추가할 수 있습니다.'
                    },
                    {
                        title: 'Enable mobile responsive by default',//'모바일 반응형 기본 적용',
                        desc: 'The default UI has been adapted so that all the elements provided by the homepage theme work flexibly on mobile.'//'홈페이지 테마에서 제공하는 모든 요소가 모바일에서도 유연하게 동작하도록 기본 UI가 적용되었습니다.'
                    },
                ]
            },
        ],
        admin: [
            {
                title: 'Control homepage preferences',//'홈페이지 기본 설정 제어',
                desc: 'The template is intact, but you can change and modify it to fit your business.'//'템플릿은 그대로, 내 비지니스에 맞도록 내용을 변경하고 수정할 수 있습니다.'
            },
            {
                title: 'Edit all posts',//'모든 게시글 편집',
                desc: 'You can freely edit the posts on each menu-specific page.'//'메뉴별 페이지마다 게시글을 자유자재로 편집할 수 있습니다.'
            },
            {
                title: 'Receive SMTP mail',//'SMTP 메일 수신',
                desc: 'Your SMTP account settings allow you to receive CONTACT messages from visitors to your homepage.'//'본인의 smtp 계정 설정으로 홈페이지 방문자의 contact 메시지를 전달받을 수 있습니다.'
            }
        ],
    },
    price: {
        essential : {
            site: 1,
            price: 49
        },
        expert : {
            site: 5,
            price: 69
        },
        agency : {
            site: 20,
            price: 199
        }
    },
    screatKey: 'bsw3rejg'
};