import React from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageUploadImputProps {
    label?: string | null;
    imageUrl?: string | null;
    width?: string | number;
    height?: string | number;
    onChange: (file: File) => void;
}

export function ImageUploadImput({ 
    label, 
    imageUrl, 
    width = '350px', 
    height = '150px', 
    onChange 
}: ImageUploadImputProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isHovering, setIsHovering] = React.useState(false);
    const [preview, setPreview] = React.useState<string | null>(imageUrl ?? null);

    React.useEffect(() => {
        setPreview(imageUrl ?? null);
    }, [imageUrl]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
            onChange(file);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleChangeClick = () => fileInputRef.current?.click();

    return (
        <Stack spacing={1}>
            {label && (
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {label}
                </Typography>
            )}

            <Box
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                sx={{
                    position: 'relative',
                    width: width,
                    height: height,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {preview ? (
                    <>
                        <Box
                            component="img"
                            src={preview}
                            alt={label ?? 'Preview'}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: 1,
                            }}
                        />
                        {isHovering && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 200ms',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={handleChangeClick}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Modifier
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleChangeClick}
                        sx={{ textTransform: 'none' }}
                    >
                        Choisir une image
                    </Button>
                )}
            </Box>

            <Typography variant="caption" color="textSecondary">
                Formats acceptés : PNG, JPG, JPEG.
            </Typography>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={handleFileSelect}
            />
        </Stack>
    );
}