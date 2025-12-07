"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

interface ProductImageUploadProps {
  form: UseFormReturn<any>;
  imageCoverPreview: string | null;
  imagesPreview: string[];
  onImageCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImageCover: () => void;
  onRemoveImage: (index: number) => void;
}

export const ProductImageUpload = ({
  form,
  imageCoverPreview,
  imagesPreview,
  onImageCoverChange,
  onImagesChange,
  onRemoveImageCover,
  onRemoveImage,
}: ProductImageUploadProps) => {
  return (
    <Card className="lg:col-span-1 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Product Images
        </CardTitle>
        <CardDescription>
          Upload cover image and additional product images.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="imageCover"
          render={({
            field: { value: _value, onChange: _onChange, ...field },
          }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-main/50 transition-colors max-w-md mx-auto">
                    <div className="relative w-full aspect-square bg-muted flex items-center justify-center">
                      {imageCoverPreview ? (
                        <Image
                          src={imageCoverPreview}
                          alt="Cover preview"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-6">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload cover image
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <Input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={onImageCoverChange}
                      {...field}
                    />
                  </div>
                  {imageCoverPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={onRemoveImageCover}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Cover Image
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({
            field: { value: _value, onChange: _onChange, ...field },
          }) => (
            <FormItem>
              <FormLabel>Additional Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-main/50 transition-colors max-w-md mx-auto">
                    <div className="relative w-full aspect-video bg-muted flex items-center justify-center p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload multiple images
                        </p>
                      </div>
                    </div>
                    <Input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      multiple
                      onChange={onImagesChange}
                      {...field}
                    />
                  </div>
                  {imagesPreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {imagesPreview.map((preview, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square rounded-lg overflow-hidden border max-w-[200px]"
                        >
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
