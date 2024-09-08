'use client'
import { useToast } from '@/components/ui/use-toast'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { Button } from '../ui/button';
import Image from 'next/image';
import { getImageSize, dataUrl } from '@/lib/gallery/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  image: any;
  publicId: string;
  type: string;
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {

  const { toast } = useToast();

  const onUploadSuccessHandler = (result : any) => {
    setImage((prevState : any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureUrl: result?.info?.secure_url,
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: 'Success',
      description: 'Image uploaded successfully',
      duration: 5000,
      className: '',
    });
  };

  const onUploadErrorHandler = () => {
    toast({
      title: 'Error',
      description: 'An error occurred while uploading the image',
      duration: 5000,
      className: '',
    });
  }

  return (
    <CldUploadWidget
      uploadPreset='jsm_imaginify'
      options={{
        multiple: false,
        resourceType: 'image',
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({open}) => (
        <div className='mt-5'>
          <h3 className='text-lg font-semibold'>Original</h3>
          {publicId ? (
            <>
            <div className='cursor-pointer overflow-hidden'>
              <CldImage 
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt='image'
                sizes={"(max-width: 767px) 100vw, 50vw"}
                className='w-1/2 h-64'
                placeholder={dataUrl as PlaceholderValue}
              />
            </div>
            </>
          ):(
            <>
            <div className='w-1/2 border min-h-[256px] items-center flex flex-col justify-center cursor-pointer' onClick={() => open()}>
              <div className='flex flex-col items-center justify-center gap-y-5'>
                <Image 
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
                <p className=''>Click here to upload image</p>
              </div>
            </div>
            </>
          )}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default MediaUploader