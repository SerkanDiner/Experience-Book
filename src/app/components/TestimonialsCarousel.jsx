'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
  lazy,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const TestimonialCard = lazy(() => import('./TestimonialCard'));

const TestimonialsCarousel = ({ testimonials }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const dotButtons = useMemo(() => {
    if (testimonials.length <= 1) return null;

    return testimonials.map((_, index) => (
      <button
        key={index}
        onClick={() => emblaApi?.scrollTo(index)}
        className={`w-3 h-3 rounded-full transition ${
          index === selectedIndex ? 'bg-orange-400' : 'bg-gray-300'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ));
  }, [testimonials, selectedIndex, emblaApi]);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-0">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div
              className="min-w-0 w-full flex-shrink-0 px-4 sm:px-6 flex justify-center"
              key={index}
            >
              <Suspense fallback={<div className="h-48">Loading...</div>}>
                <TestimonialCard {...testimonial} />
              </Suspense>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {dotButtons}
        </div>
      )}
    </div>
  );
};

export default React.memo(TestimonialsCarousel);
