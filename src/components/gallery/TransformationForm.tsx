'use client'
import { useState, useTransition, useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/lib/gallery/constants'
import CustomField from './CustomField'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/gallery/utils'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { updateCredits } from '@/actions/gallery/user.actions'
import { creditFee } from '@/lib/gallery/constants'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/actions/gallery/image.actions'
import { useRouter } from 'next/navigation'
import { InsufficientCreditsModal } from './InsufficientCreditsModal'

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {

  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  //where the data is coming from?
  const initialValues = data && action === "Update" ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  } : defaultValues

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      });
      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,        //???
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };

      if (action === "Add") {
        try {

          const newImage = await addImage({
            image: imageData,
            userId,
            path: "/gallery",
          });

          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/gallery/transformations/${newImage._id}`);
          };

        } catch (error) {
          console.log(error);
        };
      };

      if (action === "Update") {
        try {

          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id,
            },
            userId,
            path: `/gallery/transformations/${data._id}`,
          });

          if (updatedImage) {
            router.push(`/gallery/transformations/${updatedImage._id}`);
          };

        } catch (error) {
          console.log(error);
        };
      };
    };

    setIsSubmitting(false);

  }

  const onSelecteFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSizes = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSizes.aspectRatio,
      width: imageSizes.width,
      height: imageSizes.height,
    }));

    setNewTransformation(transformationType.config);

    return onChangeField(value);

  }

  const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value
        }
      }))
    }, 1000)();

    return onChangeField(value)
  }

  // to updadte creditFee to something else
  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig));
    setNewTransformation(null);
    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  }

  useEffect(() => {
    if (image && (type === 'restore' || type === 'removeBackground')) {
      setNewTransformation(transformationType.config);
    };
  }, [image, transformationType.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className='w-full'
          render={({ field }) => <Input {...field} />}
        />

        {type === 'fill' && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className='w-full'
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelecteFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className='w-[240px]'>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key}>
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div>
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={type === 'remove' ? "Object to remove" : "Object to ReColor"}
              className='w-full'
              render={({ field }) => <Input
                value={field.value}
                placeholder={type === 'remove' ? "Enter object to remove" : "Enter object to recolor"}
                onChange={(e) => onInputChangeHandler('prompt', e.target.value, type, field.onChange)}
              />
              }
            />
            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className='w-full'
                render={({ field }) => <Input
                  value={field.value}
                  placeholder="Enter color"
                  onChange={(e) => onInputChangeHandler('color', e.target.value, 'recolor', field.onChange)}
                />}
              />
            )}
          </div>
        )}

        {/* Cloudinary Transformation Preview */}
        <div className='flex w-full items-center gap-5'>
          <div className='flex w-1/2'>
            <CustomField
              control={form.control}
              name="publicId"
              formLabel="Image Preview"
              className='flex size-full flex-col'
              render={({ field }) => (
                <MediaUploader
                  onValueChange={field.onChange}
                  setImage={setImage}
                  publicId={field.value}
                  image={image}
                  type={type}
                />
              )}
            />
          </div>

          <div className='w-1/2 '>
            <h2 className='text-lg font-bold mt-5'>Transformation Preview</h2>
            <div className='min-h-[256px] border'>
              <TransformedImage
                image={image}
                type={type}
                title={form.getValues().title}
                isTransforming={isTransforming}
                setIsTransforming={setIsTransforming}
                transformationConfig={transformationConfig}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-10 justify-center w-full'>
          <Button type="button" className="w-1/4" disabled={isSubmitting || newTransformation === null} onClick={onTransformHandler}>
            {isTransforming ? "Transforming" : "Apply Transformation"}
          </Button>
          <Button type="submit" className="w-1/4" disabled={isSubmitting}>
            {isSubmitting ? "Submitting" : `Save`}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm