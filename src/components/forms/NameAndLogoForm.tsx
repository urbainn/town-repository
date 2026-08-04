import { Stack, TextField } from "@mui/material";
import { ImageUploadImput } from "./ImageUploadInput";

interface NameAndLogoFormProps {
    name: string;
    logoUrl: string;
    onChange: (name: string, logoUrl: string) => void;
}

function NameAndLogoForm({ name, logoUrl, onChange }: NameAndLogoFormProps) {
    return (
        <Stack direction="column" spacing={3}>
            <TextField
                label="Nom de l'annuaire"
                value={name}
                onChange={(e) => onChange(e.target.value, logoUrl)}
            />
            <ImageUploadImput
                label="Logo de l'annuaire"
                imageUrl={logoUrl}
                onChange={(imageBuffer, file) => {
                    // Here you would typically upload the image and get a URL back
                }}
            />
        </Stack>
    );
}

export default NameAndLogoForm;