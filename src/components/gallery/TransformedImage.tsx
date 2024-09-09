import React from 'react'
import { Button } from '../ui/button'
import { Download } from 'lucide-react';
import { CldImage } from 'next-cloudinary'
import { getImageSize, dataUrl, debounce } from '@/lib/gallery/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {

  const downloadHandler = () => { };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex-between'>
        {hasDownload && (
          <Button
            variant={'default'}
            size={'icon'}
            className='p-2 rounded-md'
            onClick={downloadHandler}
          >
            <Download className='size-5' />
          </Button>
        )}
      </div>
      {image?.publicId && transformationConfig ? (
        <div className='relative'>
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={image?.title}
            sizes={"(max-width: 767px) 100vw, 50vw"}
            className='min-h-64'
            placeholder={dataUrl as PlaceholderValue}
            onLoad={() => { setIsTransforming && setIsTransforming(false) }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false)
              }, 8000);
            }}
            {...transformationConfig}   // This is the transformation configuration
          />

          {isTransforming && (
            <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex items-center justify-center'>
              <p className='text-lg font-semibold'>Transforming...</p>
            </div>
          )}
        </div>
      ) : (
        <div className='flex items-center'>
          <p className='text-gray-500'>Transformted image</p>
        </div>
      )}
    </div>
  )
}

export default TransformedImage