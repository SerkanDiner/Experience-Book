import Link from 'next/link';

const TestimonialCard = ({ name, role, image, title, quote }) => {
  return (
    <div className="px-2 sm:px-4 w-full">
      
        <figure className="flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-white border border-orange-400 dark:border-orange-400 rounded-lg dark:bg-gray-800">
          <blockquote className="max-w-md sm:max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="my-2 sm:my-4 text-sm sm:text-base">"{quote}"</p>
          </blockquote>
          <figcaption className="flex items-center justify-center mt-2">
            <img
              className="rounded-full w-8 h-8 sm:w-9 sm:h-9"
              src={image}
              alt={name}
            />
            <div className="ms-2 sm:ms-3 space-y-0.5 font-medium dark:text-white text-left">
              <div className="text-sm sm:text-base">{name}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {role}
              </div>
            </div>
          </figcaption>
        </figure>
      
    </div>
  );
};

export default TestimonialCard;