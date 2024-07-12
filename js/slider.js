function awaitPromise(time)
{
    return new Promise(resolve => {
        setTimeout(resolve, time * 1000);
    })
}

class Slider {
    constructor(element_id)
    {
        this.mainElement = document.getElementById(element_id);
        this.sliderImages = [].slice.call(this.mainElement.children);
        this.currentSlide = undefined;
        this.sliderManager = undefined;
        this.cancelNextPromise = false;
        this.dotContainer = undefined;
        this.dotList = [];
    }

    initialize()
    {
        this.currentSlide = 0;
        this.appendDots();
        this.appendArrows();
        this.updateCurrentImage(true, false);
        this.loadNextSlide();
    }

    loadNextSlide()
    {
        // slide cycle
        this.sliderManager = awaitPromise(4);
        this.sliderManager.then(() => {
            if(!this.cancelNextPromise)
            {
                const oldSlide = this.currentSlide;
                this.currentSlide = this.obtainNextImage();
                this.updateCurrentImage(false, (this.currentSlide < oldSlide));

                this.loadNextSlide();
            }
        })
    }

    updateCurrentImage(initializing, right)
    {
        // update and add animation for slide
        this.sliderImages.forEach((image, index) => {
            if(index === this.currentSlide)
                {
                    // visible image
                    image.style['z-index'] = (5+index);
                    if(!initializing)
                    {
                        image.style['animation'] = ((right) ? 'slideLeft' : 'slideRight') + ' 1s ease-in-out';
                    }
                } else {
                    if(right && index === this.obtainNextImage())
                    {
                        image.style['z-index'] = -1;
                    }
                    if(!right && index === this.obtainPrevImage())
                    {
                        image.style['z-index'] = -1;
                    } else {
                        image.style['z-index'] = -30;
                    }
                    image.style['animation'] = 'null';
                }
        });

        this.dotList.forEach((dot, index) =>
        {
            if(index === this.currentSlide)
            {
                awaitPromise(1).then(() => {
                    dot.style['height'] = '1.25rem';
                    dot.style['width'] = '1.25rem';
                    dot.style['background-color'] = 'rgb(0, 0, 0, .8)';
                });
            } else {
                if(dot.style.height !== '0.75rem')
                {
                    awaitPromise(1).then(() => {
                        dot.style['height'] = '0.75rem';
                        dot.style['width'] = '0.75rem';
                        dot.style['background-color'] = 'rgb(255, 255, 255, .8)';
                    });
                }                
            }
        });
    }

    hardUpdateImage(right)
    {
        // update and add animation for slide
        this.sliderImages.forEach((image, index) => {
            if(index === this.currentSlide)
            {
                // visible image
                image.style['z-index'] = (5+index);
                image.style['animation'] = ((right) ? 'slideLeft' : 'slideRight') + ' 1s ease-in-out';
            } else {
                if(right && index === this.obtainNextImage())
                {
                    image.style['z-index'] = -1;
                } else if(!right && index === this.obtainPrevImage())
                {
                    image.style['z-index'] = -1;
                } else {
                    image.style['z-index'] = -30;
                }
                image.style['animation'] = 'null';
            }
        });

        this.dotList.forEach((dot, index) =>
        {
            if(index === this.currentSlide)
            {
                dot.style['height'] = '1.25rem';
                dot.style['width'] = '1.25rem';
                dot.style['background-color'] = 'rgb(0, 0, 0, .8)';
            } else {
                if(dot.style.height !== '0.75rem')
                {
                    dot.style['height'] = '0.75rem';
                    dot.style['width'] = '0.75rem';
                    dot.style['background-color'] = 'rgb(255, 255, 255, .8)';
                }                
            }
        });
    }

    obtainNextImage()
    {
        // calculate next slide
        if((this.currentSlide) >= (this.sliderImages.length - 1))
        {
            return 0;
        } else {
            return (this.currentSlide + 1);
        }
    }

    obtainPrevImage()
    {
        // calculate next slide
        if((this.currentSlide) === 0)
        {
            return (this.sliderImages.length - 1);
        } else {
            return (this.currentSlide - 1);
        }
    }

    updateSlidePosition(position)
    {
        // move to selected slide
        const alreadyCanceled = this.cancelNextPromise;
        this.cancelNextPromise = true;
        const oldSlide = this.currentSlide;
        this.currentSlide = position;
        this.hardUpdateImage((this.currentSlide < oldSlide));
    
        if(!alreadyCanceled)
        {
            // restart sliding
            this.sliderManager = awaitPromise(5);
            this.sliderManager.then(() => {
                this.cancelNextPromise = false;
                this.loadNextSlide();
            });
        }
    }

    appendDots() {
        this.dotContainer = document.createElement('div');
        this.dotContainer.classList.add('slider__container__dots');
        this.mainElement.appendChild(this.dotContainer);

        for(let i = 0; i < this.sliderImages.length; i++)
        {
            const dot = document.createElement('div');
            dot.classList.add('slider__container__dot');
            dot.addEventListener('click', () => this.updateSlidePosition(i));
            this.dotContainer.appendChild(dot);
            this.dotList.push(dot);            
        }
    }

    appendArrows() {
        const leftArrow = document.createElement('div');
        leftArrow.classList.add('slider__container__arrow');
        leftArrow.textContent = '<';
        leftArrow.addEventListener('click', () => this.updateSlidePosition(this.obtainPrevImage()));
        this.mainElement.appendChild(leftArrow);

        const rightArrow = document.createElement('div');
        rightArrow.classList.add('slider__container__arrow');
        rightArrow.classList.add('slider__container__arrow--right');
        rightArrow.textContent = '>';
        rightArrow.addEventListener('click', () => this.updateSlidePosition(this.obtainNextImage()));
        this.mainElement.appendChild(rightArrow);
    }
}

const sliderObject = new Slider('slider');
sliderObject.initialize();