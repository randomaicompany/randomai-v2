export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				'yt-1': {
					'0%': { transform: 'translateX(-35%) scaleX(0.3)' },
					'60%': { transform: 'translateX(110%) scaleX(0.7)' },
					'100%': { transform: 'translateX(110%) scaleX(0.7)' }
				},
				'yt-2': {
					'0%': { transform: 'translateX(-200%) scaleX(0.3)' },
					'60%': { transform: 'translateX(90%) scaleX(0.4)' },
					'100%': { transform: 'translateX(90%) scaleX(0.4)' }
				}
			},
			animation: {
				'yt-1': 'yt-1 2.1s cubic-bezier(0.4,0,0.2,1) infinite',
				'yt-2': 'yt-2 2.1s cubic-bezier(0.4,0,0.2,1) 0.3s infinite'
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				ultra: ['Ultra', 'sans-serif'],
				inter: ['Inter', 'sans-serif']
			},
			boxShadow: {
				bordered: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
			},
			colors: {
				'brand-primary': '#3D3D3D',
				'brand-secondary': '#434D56',
				'brand-tertiary': '#A9B2B9',
				'brand-accent': '#CA3C4A',
				'brand-accent-light': '#ED7675',
				'brand-black': '#090B0D',
				'brand-black-2': '#1A2129',
				'brand-green': '#58885A',
				'brand-mint': '#E3EBE0',
				'brand-smoke': '#FAFAFA',
				'brand-smoke-darker': '#F2F2F2'
			}
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		}
	},
	plugins: [require('tailwind-scrollbar-hide')]
};
