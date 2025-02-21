/** 
 * Author: Shadow Themes
 * Author URL: http://shadow-themes.com
 */
"use strict";

let kdarts_ribbon = {
	$el: jQuery('.kdarts-albums-carousel'),
	type: 'large',
	target: 0,
	current: 0,
	isDown: false,
	isDownLink: false,
	isLinkMoved: false,
	isTouch: false,
	
	// Scroll Speed Option for Touch Devices
	touchSpeed: {
		vertical: 2, // Speed factor for Vertical Ribbon
		horizontal: 2, // Speed factor for Horizontal Ribbon
	},

	init: function() {
		if (kdarts_ribbon.$el.hasClass('is-medium')) {
			kdarts_ribbon.$bar = kdarts_ribbon.$el.parent().children('.kdarts-albums-carousel-progress');
			kdarts_ribbon.barTarget = 0;
			kdarts_ribbon.barCurrent = 0;
			kdarts_ribbon.type = 'medium';
		}		
		if (kdarts_ribbon.$el.hasClass('is-vertical')) {
			kdarts_ribbon.type = 'vertical';
		}

		// Mouse Events
		kdarts_ribbon.$el.on('mousedown', function(e) {
			if (kdarts_ribbon.isTouch) {
				kdarts_ribbon.isTouch = false;
			}
			if (!kdarts_ribbon.$el.hasClass('is-hovered')) {
				e.preventDefault();
				kdarts_ribbon.isDown = true;
				kdarts_ribbon.$el.addClass('is-grabbed');
				if (kdarts_ribbon.type == 'vertical') {
					kdarts_ribbon.old_pageX = e.clientY;
				} else {
					kdarts_ribbon.old_pageX = e.clientX;
				}
			}
			
		}).on('mouseup', function() {
			kdarts_ribbon.isDown = false;
			kdarts_ribbon.$el.removeClass('is-grabbed');
			kdarts_ribbon.isDownLink = false;
		}).on('mouseleave', function() {
			kdarts_ribbon.isDown = false;
			kdarts_ribbon.$el.removeClass('is-grabbed');
			kdarts_ribbon.isDownLink = false;
		}).on('mousemove', function(e) {
			e.preventDefault();
			if (kdarts_ribbon.isDown) {
				if (kdarts_ribbon.type == 'vertical') {
					let newX = (kdarts_ribbon.old_pageX - e.clientY)*2,
						newTop = $kdarts_window.scrollTop() + newX;
					kdarts_ribbon.old_pageX = e.clientY;
					$kdarts_window.scrollTop(newTop);
				} else {
					let newX = kdarts_ribbon.old_pageX - e.clientX,
						newTop = $kdarts_window.scrollTop() + newX;
					kdarts_ribbon.old_pageX = e.clientX;
					$kdarts_window.scrollTop(newTop);					
				}
			}
			if (kdarts_ribbon.isDownLink) {
				kdarts_ribbon.isLinkMoved = true;
			} else {
				kdarts_ribbon.isLinkMoved = false;
			}
		});
		
		// Touch Events
		kdarts_ribbon.$el[0].addEventListener('touchstart', function(e) {
			if (!kdarts_ribbon.isTouch) {
				kdarts_ribbon.isTouch = true;
			}
			kdarts_ribbon.isDown = true;
			kdarts_ribbon.$el.addClass('is-grabbed');
			if (kdarts_ribbon.type == 'vertical') {
				kdarts_ribbon.old_pageX = e.touches[0].clientY;
			} else {
				kdarts_ribbon.old_pageX = e.touches[0].clientX;
			}
		}, false);
		kdarts_ribbon.$el[0].addEventListener('touchmove', function(e) {
			if (kdarts_ribbon.isDown) {
				if (kdarts_ribbon.type == 'vertical') {
					let newX = (kdarts_ribbon.old_pageX - e.touches[0].clientY)*kdarts_ribbon.touchSpeed.vertical,
						newTop = $kdarts_window.scrollTop() + newX;
					kdarts_ribbon.old_pageX = e.touches[0].clientY;
					$kdarts_window.scrollTop(newTop);
				} else {
					let newX = (kdarts_ribbon.old_pageX - e.touches[0].clientX)*kdarts_ribbon.touchSpeed.horizontal,
						newTop = $kdarts_window.scrollTop() + newX;
					kdarts_ribbon.old_pageX = e.touches[0].clientX;
					$kdarts_window.scrollTop(newTop);
				}
			}
			if (kdarts_ribbon.isDownLink) {
				kdarts_ribbon.isLinkMoved = true;
			} else {
				kdarts_ribbon.isLinkMoved = false;
			}			
		}, false);
		kdarts_ribbon.$el[0].addEventListener('touchend', function(e) {
			kdarts_ribbon.isDown = false;
			kdarts_ribbon.$el.removeClass('is-grabbed');
			kdarts_ribbon.isDownLink = false;
		}, false);

		// Links and Buttons
		kdarts_ribbon.$el.find('a.kdarts-button').on('mouseover', function() {
			if (!kdarts_ribbon.isTouch) {
				kdarts_ribbon.$el.addClass('is-hovered');
			}
		}).on('mouseout', function(){
			kdarts_ribbon.$el.removeClass('is-hovered');
		});
		kdarts_ribbon.$el.find('a').on('mousedown', function() {
			kdarts_ribbon.isDownLink = true;
		}).on('click', function(e) {
			if (kdarts_ribbon.isLinkMoved) {
				e.preventDefault();
				return false;
			}
			kdarts_ribbon.isDownLink = false;
			kdarts_ribbon.isLinkMoved = false;
		});
		
		kdarts_ribbon.$el.find('.kdarts-album-item').each(function() {
			if ('IntersectionObserver' in window) {
				kdarts_ribbon.observer.observe(this);
			} else {
				jQuery(this).children('.kdarts-album-item__inner').addClass('is-inview');
			}
		});

		// Layout
		kdarts_ribbon.layout();

		// Start Animation
		kdarts_ribbon.animate();
	},
	layout: function() {
		let $this = kdarts_ribbon.$el,
			fullWidth = 0,
			setHeight;

		if (kdarts_ribbon.type == 'large') {
			setHeight = $kdarts_window.height() - $kdarts_header.height() - $kdarts_footer.height();
			$this.css('top', $kdarts_header.height());
		}
		if (kdarts_ribbon.type == 'medium') {
			setHeight = $kdarts_window.height()/2;
		}

		if (kdarts_ribbon.type == 'large' || kdarts_ribbon.type == 'medium') {
			$this.height(setHeight).find('.kdarts-album-item__title').width(setHeight);
			$this.find('.kdarts-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img');

				if ($this_slide_img.attr('height') && $this_slide_img.attr('width')) {
					$this_slide.height(setHeight);
					let imgRatio = parseInt($this_slide_img.attr('width'), 10)/parseInt($this_slide_img.attr('height'), 10),
						setWidth = setHeight*imgRatio;

					$this_slide_img.height(setHeight).width(setWidth);
					fullWidth = fullWidth + $this_slide.width();
				} else {
					$this_slide.height(setHeight);
				}
			});
		}

		if (kdarts_ribbon.type == 'vertical') {
			$this.find('.kdarts-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img'),
					setHeight = $this_slide_img.height();

				$this_slide.find('.kdarts-album-item__title').width(setHeight);

				fullWidth = fullWidth + $this_slide.height();
			});
			fullWidth = fullWidth + $kdarts_header.height() + $kdarts_footer.height();
			$this.css('padding', $kdarts_header.height()+'px 0 ' + $kdarts_footer.height() + 'px 0')
			$this.height(fullWidth);
		} else {
			$this.width(fullWidth);
		}

		if (kdarts_ribbon.type == 'vertical') {
			let body_height = fullWidth;
			$kdarts_body.height(body_height);
		} else {
			let spacingLeft = parseInt($this.find('.kdarts-album-item__inner').css('margin-right'), 10),
				body_height = fullWidth - $kdarts_window.width() + spacingLeft + $kdarts_window.height();


			$this.css('padding-left', spacingLeft + 'px');
			$kdarts_body.height(body_height);
		}
	},
	animate: function() {
		if (kdarts_ribbon.type == 'vertical') {
			// Scroll Content
			kdarts_ribbon.current += ((kdarts_ribbon.target - kdarts_ribbon.current) * 0.1);
			kdarts_ribbon.$el.css('transform', 'translate3d(0, -'+ kdarts_ribbon.current +'px, 0)');
			// Img Motion Effect
			let img_current = (kdarts_ribbon.target - kdarts_ribbon.current) * 0.1;
			kdarts_ribbon.$el.find('.kdarts-album-item__overlay').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
			kdarts_ribbon.$el.find('img').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
		} else {
			// Scroll Content
			kdarts_ribbon.current += ((kdarts_ribbon.target - kdarts_ribbon.current) * 0.1);
			kdarts_ribbon.$el.css('transform', 'translate3d(-'+ kdarts_ribbon.current +'px, 0, 0)');
			// Img Motion Effect
			let img_current = (kdarts_ribbon.target - kdarts_ribbon.current) * 0.1;
			kdarts_ribbon.$el.find('.kdarts-album-item__overlay').css('transform', 'translate3d('+ img_current +'px, 0, 0)');
			kdarts_ribbon.$el.find('img').css('transform', 'translate3d('+ img_current +'px, 0, 0)');			
			// Bar Update
			if (kdarts_ribbon.type == 'medium') {
				kdarts_ribbon.barCurrent += ((kdarts_ribbon.barTarget - kdarts_ribbon.barCurrent) * 0.1);
				kdarts_ribbon.$bar.children('.kdarts-albums-carousel-progress__bar').width(kdarts_ribbon.barCurrent);
			}			
		}
		// Update Frame
		requestAnimationFrame( kdarts_ribbon.animate );
	}
};
if ('IntersectionObserver' in window) {
	kdarts_ribbon.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting) {
				jQuery(entry.target).children('.kdarts-album-item__inner').addClass('is-inview');
			} else {
				jQuery(entry.target).children('.kdarts-album-item__inner').removeClass('is-inview');
			}
		});
	});
}

jQuery(document).ready( function() {
	kdarts_ribbon.init();
});

$kdarts_window.on('resize', function() {
	// Window Resize Actions
    kdarts_ribbon.layout();
	setTimeout(kdarts_ribbon.layout(), 500);
}).on('load', function() {
	// Window Load Actions
    kdarts_ribbon.layout();
}).on('scroll', function() {
	if ($kdarts_body.hasClass('kdarts-albums-template--carousel')) {
		kdarts_ribbon.target = $kdarts_window.scrollTop();
		if (kdarts_ribbon.type == 'medium') {
			let percent = Math.ceil($kdarts_window.scrollTop() * 100 / ($kdarts_body.height() - $kdarts_window.height()));
			kdarts_ribbon.barTarget = kdarts_ribbon.$bar.width() * (percent/100);
		}
	}
});