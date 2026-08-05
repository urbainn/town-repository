import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { t } from "../../core/i18n";
import AppPageProps from "../AppPageProps";
import { useEffect, useState } from "react";
import TownSelectionPage from "./TownSelectionPage";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import TownLauCodesForm from "../../components/forms/TownLauCodesForm";
import RepoLogoForm from "../../components/forms/RepoLogoForm";
import HeaderVisualisation from "../../components/display/HeaderVisualisation";

function TownCreationPage({ navigate, setHeader }: AppPageProps) {

    // Current step of the creation process
    const [step, setStep] = useState(1);

    // Form values
    const [title, setTitle] = useState("");
    const [country, setCountry] = useState("france");
    const [lauCodes, setLauCodes] = useState<string[]>([]);

    // Visual identity
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [primaryColor, setPrimaryColor] = useState<string | null>(null);
    const [secondaryColor, setSecondaryColor] = useState<string | null>(null);
    const [logoEnableBg, setLogoEnableBg] = useState<boolean>(true);

    // Set header
    useEffect(() => {
        setHeader({ show: true, text: t('Nouvel annuaire') + ' (' + step + '/4)', onBack: handleBack });
    }, [step]);

    // Go back to town list
    const handleGoSelectionScreen = () => {
        navigate(<TownSelectionPage navigate={navigate} setHeader={setHeader} />, { show: false, text: "" });
    };
    
    // Back 1 step (or goes back to town list if on first step)
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            handleGoSelectionScreen();
        }
    };

    // Go to next step
    const handleNext = () => {
        setStep(step + 1);
    };

    return (
    
        <div className="contain-center">
            <div className="content" style={{ width: 500 }}>
                <div className="mt-4">

                    {step === 1 && (
                    
                    <Stack direction="column" spacing={3}>

                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            {t("Informations")}
                        </Typography>

                        <TextField id="outlined-basic" label="Titre de l'annuaire" variant="outlined" size="medium" fullWidth
                            placeholder={t("Annuaire de VILLE")}
                            value={title}
                            onChange={(event) => { setTitle(event.target.value); }}
                        />
                        
                        <FormControl fullWidth error={country === "other"}>
                            <InputLabel id="country-select-label">Pays</InputLabel>
                            <Select
                                labelId="country-select-label"
                                id="country-select"
                                value={country}
                                label="Pays"
                                onChange={(event) => setCountry(event.target.value as string)}
                            >
                                <MenuItem value="france">France</MenuItem>
                                <MenuItem value="other">Autre</MenuItem>
                            </Select>
                        </FormControl>

                        {country === "other" && (
                            <Alert severity='error'>{t("Pour l'instant, seuls les annuaires en France sont supportés.")}</Alert>
                        )}
                    
                    </Stack>

                    )}

                    {step === 2 && (
                        <Stack direction="column" spacing={3}>
                            <div>
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>{t("Données géographiques")}</Typography>
                                <Typography variant="body1">{t("Ajoutez les communes qui participent à l'annuaire.")}</Typography>
                            </div>
                            
                            <TownLauCodesForm lauCodes={lauCodes} onChange={(newLauCodes) => setLauCodes(newLauCodes)} />
                        </Stack>
                    )}

                    {step === 3 && (
                        <Stack direction="column" spacing={3}>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>{t("Identité visuelle")}</Typography>
                            <RepoLogoForm logoUrl={logoUrl} onLogoChange={(newLogo, url) => { setLogo(newLogo); setLogoUrl(url); }} />
                            {logo && (
                                <HeaderVisualisation name={title} logo={logo} logoEnableBg={false} />
                            )}
                        </Stack>
                    )}

                    {step === 4 && (
                        <Stack direction="column" spacing={3}>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>{t("Couleurs")}</Typography>
                            <HeaderVisualisation name={title} logo={logo} primaryColor={primaryColor ?? undefined} secondaryColor={secondaryColor ?? undefined} logoEnableBg={logoEnableBg} />
                        </Stack>
                    )}

                </div>

                <div className="flex gap-1 mt-2 mb-4">
                    <Button variant="outlined" color="secondary" onClick={handleBack} className="width-100" startIcon={<ArrowBack />}>
                        {step === 1 ? t("Annuler") : t("Retour")}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNext} className="width-100" endIcon={<ArrowForward />}
                    disabled={step === 1 && (country === "other" || title === "") || step === 2 && lauCodes.length === 0}>
                        {step === 4 ? t("Terminer") : t("Suivant")}
                    </Button>
                </div>
            </div>
        </div>
    
    )

}

export default TownCreationPage;