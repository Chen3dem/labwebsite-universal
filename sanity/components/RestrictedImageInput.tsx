import React, { useRef, useState, useCallback } from 'react';
import { Button, Card, Flex, Stack, Text, useToast, Box } from '@sanity/ui';
import { UploadIcon, RefreshIcon, TrashIcon } from '@sanity/icons';
import { ObjectInputProps, set, unset, useClient } from 'sanity';
import imageCompression from 'browser-image-compression';

export function RestrictedImageInput(props: ObjectInputProps) {
    const { value, onChange } = props;
    const client = useClient({ apiVersion: '2024-01-01' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const toast = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const processFile = async (file: File) => {
        setIsCompressing(true);
        try {
            // Compression Options
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: 'image/jpeg',
                initialQuality: 0.8
            };

            console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);
            const compressedFile = await imageCompression(file, options);
            console.log(`Compressed: ${(compressedFile.size / 1024).toFixed(2)} KB`);

            // Upload
            const assetDocument = await client.assets.upload('image', compressedFile, {
                filename: file.name,
                contentType: compressedFile.type
            });

            // Patch the field
            onChange(set({
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: assetDocument._id
                }
            }));

            toast.push({
                status: 'success',
                title: 'Image Compressed & Uploaded',
                description: `Reduced to ${(compressedFile.size / 1024).toFixed(0)}KB`
            });

        } catch (error) {
            console.error("Upload failed:", error);
            toast.push({
                status: 'error',
                title: 'Upload Failed',
                description: 'Could not compress or upload image.'
            });
        } finally {
            setIsCompressing(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // If we have a value, render the default input (which shows preview, hotspots, etc.)
    // BUT we prepend a message or custom action if we want. 
    // For now, let's just allow the default render when populated, 
    // because the "Accidental 9MB Upload" usually refers to the initial state.
    // We can also override the "Replace" functionality by rendering our own controls even when populated, 
    // but let's start with the Empty State replacement.
    if (value?.asset) {
        return (
            <Stack space={3}>
                {/* Render Default Preview/Hotspot UI */}
                {props.renderDefault(props)}

                {/* Optional: Add a note or extra controls */}
                <Card padding={2} tone="primary" radius={2} border>
                    <Text size={1} muted align="center">
                        Image is managed. To replace, remove passing the field and re-upload.
                    </Text>
                </Card>
            </Stack>
        );
    }

    // EMPTY STATE: Custom UI only. No default "Drop Zone".
    return (
        <Card padding={4} border radius={2} tone="transparent">
            <Flex align="center" justify="center" direction="column" gap={4} padding={4}>
                <Stack space={3} style={{ textAlign: 'center' }}>
                    <Text size={2} weight="bold">Upload Image (Compressed)</Text>
                    <Text size={1} muted>
                        Select an image. It will be automatically <br />compressed (Max 0.5MB, 1920px).
                    </Text>
                </Stack>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <Button
                    icon={UploadIcon}
                    mode="default"
                    tone="primary"
                    text={isCompressing ? "Compressing..." : "Select Image"}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    size={3}
                />

                {isCompressing && <Text size={1} muted>Optimizing your image...</Text>}
            </Flex>
        </Card>
    );
}
