import { Delete } from "@mui/icons-material";
import { Autocomplete, CircularProgress, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { t } from "../../core/i18n";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { CommuneGeoInfo, GeoApiService } from "../../core/services/api/france/GeoApiService";
import Alert from "@mui/material/Alert";

interface TownLauCodesFormProps {
    lauCodes: string[];
    onChange: (lauCodes: string[]) => void;
}

function TownLauCodesForm({ lauCodes, onChange }: TownLauCodesFormProps) {

    const handleRemoveLauCode = (index: number) => {
        const updatedLauCodes = [...lauCodes];
        updatedLauCodes.splice(index, 1);
        onChange(updatedLauCodes);
    };

    const handleAddLauCode = (code: string) => {
        if (code && !lauCodes.includes(code)) {
            onChange([...lauCodes, code]);
        }
    };

    return (
        <Stack direction="column" spacing={2}>
            {lauCodes.map((code, index) => (
                <TownLauCodeEntry key={index} i={index} code={code} onRemove={handleRemoveLauCode} />
            ))}

            <div>
                {lauCodes.length > 0 && (
                    <div className="mb-1 pt-1">
                        <Typography variant="h6" sx={{ mb: 0.6 }}>{t("Ajouter une autre commune")}</Typography>
                        <Divider />
                    </div>
                )}
                <TownLauCodeAddEntry onAdd={handleAddLauCode} />
            </div>
        </Stack>
    );

}

function TownLauCodeEntry({ i, code, onRemove }: { i: number, code: string; onRemove: (i: number) => void }) {

    const [communeInfo, setCommuneInfo] = useState<CommuneGeoInfo | null>(null);

    useEffect(() => {
        const fetchCommuneInfo = async () => {
            const info = await GeoApiService.getCommuneInfo(code);
            setCommuneInfo(info);
        };
        setTimeout(fetchCommuneInfo, i * 200);
    }, [code]);

    return (
        <Paper variant="outlined" className="flex align-center space-between p-1">
            {communeInfo ? (
                <>
                    <div className="flex align-center gap-1">
                        <Paper sx={{width: 35, height: 35, backgroundColor: "primary.main" }} className="flex align-center center" elevation={0}>
                            <p className="fw-600 fg-white">{i + 1}</p>
                        </Paper>

                        <div>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{communeInfo.nom}, {communeInfo.codesPostaux[0] ?? ''}</Typography>
                        <Typography variant="body2" color="textSecondary">{communeInfo.population} habitants</Typography>
                        </div>
                    </div>

                    <div>
                        <IconButton onClick={() => onRemove(i)} color="info">
                            <Delete />
                        </IconButton>
                    </div>
                </>
            ) : (
                <div className="flex align-center center" style={{ width: "100%" }}>
                    <CircularProgress />
                </div>
            )}
        </Paper>
    );
}

function TownLauCodeAddEntry({ onAdd }: { onAdd: (code: string) => void }) {
    const [codePostal, setCodePostal] = useState("");
    const [communes, setCommunes] = useState<{ label: string; lau: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAdd = (lauCode: string) => {
        onAdd(lauCode);
        setCodePostal("");
    };

    const handleCodePostalChange = async (value: string) => {
        const sanitizedValue = value.replace(/\D/g, "").slice(0, 5);
        setCodePostal(sanitizedValue);
        setError(null);
        setCommunes([]);

        if (sanitizedValue.length === 5) {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedCommunes = await GeoApiService.getCommunesByPostalCode(sanitizedValue);
                setCommunes(fetchedCommunes.map(commune => ({ label: commune.nom, lau: commune.code })));
                if (fetchedCommunes.length === 0) {
                    setError(t("Aucune commune trouvée pour ce code postal."));
                }
            } catch (err) {
                setError(t("Une erreur s'est produite lors de la récupération des communes."));
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div>
            <div className="flex align-center gap-1">
                <TextField 
                    sx={{ width: codePostal.length < 5 ? '100%' : '9rem', transition: 'width 0.2s ease-out' }}
                    label={t("Code postal")}
                    value={codePostal}
                    onChange={(e) => handleCodePostalChange(e.target.value)}
                    variant="outlined"
                />
                {codePostal.length === 5 && (
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={communes}
                        getOptionLabel={(option) => option.label}
                        loading={isLoading}
                        onChange={(_, newValue) => {
                            if (newValue) {
                                handleAdd(newValue.lau);
                            }
                        }}
                        disabled={communes.length === 0}
                        renderInput={(params) => <TextField {...params} label={t("Commune")} variant="outlined" />}
                    />
                )}
            </div>

            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        </div>
    );
}

export default TownLauCodesForm;