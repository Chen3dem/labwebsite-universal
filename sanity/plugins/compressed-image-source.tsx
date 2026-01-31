import { AssetSourceComponentProps, AssetFromSource } from 'sanity';
import { Card, Stack, Text, Button, Flex, ToastProvider, useToast } from '@sanity/ui';
import { UploadIcon } from '@sanity/icons';
import { useRef, useState } from 'react';
import { useClient } from 'sanity';
import imageCompression from 'browser-image-compression';
import React from 'react';

export const CompressedImageSource: React.FC<AssetSourceComponentProps> = (props) => {
    const { onSelect, onClose } = props;
    const client = useClient({ apiVersion: '2024-01-01' });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const toast = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsCompressing(true);

        try {
            // 1. Compress
            const options = {
                maxSizeMB: 0.5,           // Target 500KB
                maxWidthOrHeight: 1920,   // Full HD
                useWebWorker: true,
                fileType: 'image/jpeg',   // Force JPEG for better compression
                initialQuality: 0.8       // Good quality/size balance
            };

            const compressedFile = await imageCompression(file, options);

            // Log logic for the user to see in console if needed
            console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);
            console.log(`Compressed: ${(compressedFile.size / 1024).toFixed(2)} KB`);

            // 2. Upload to Sanity
            const assetDocument = await client.assets.upload('image', compressedFile, {
                filename: file.name,
                contentType: compressedFile.type
            });

            // 3. Select the uploaded asset
            const assetFromSource: AssetFromSource = {
                kind: 'assetDocumentId',
                value: assetDocument._id
            };

            onSelect([assetFromSource]);

        } catch (error) {
            console.error("Compression/Upload failed:", error);
            toast.push({
                status: 'error',
                title: 'Upload Failed',
                description: 'Could not compress or upload image.'
            });
            setIsCompressing(false);
        }
    };

    return (
        <Card padding={4} height="fill">
            <Flex align="center" justify="center" height="fill" direction="column" gap={4}>
                <Stack space={3} style={{ textAlign: 'center' }}>
                    <Text size={2} weight="bold">Compress & Upload</Text>
                    <Text size={1} muted>
                        Images are automatically compressed to ~500KB <br />
                        and resized to max 1920px width/height.
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
                    mode="ghost"
                    text={isCompressing ? "Compressing & Uploading..." : "Select Image to Compress"}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    tone="primary"
                    padding={4}
                    fontSize={2}
                />

                {isCompressing && <Text size={1} muted>This may take a moment...</Text>}
            </Flex>
        </Card>
    );
};

export const compressedImageSource = {
    name: 'compressed-image-source',
    title: 'Compress & Upload',
    component: CompressedImageSource,
    icon: UploadIcon
};
