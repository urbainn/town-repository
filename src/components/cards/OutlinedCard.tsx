import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

function OutlinedCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick?: () => void }) {

    return (
        <Card variant="outlined" sx={{ width: 500, borderRadius: 2 }}>
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <div className="flex align-center gap-1">
                    
                        <div style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {icon}
                        </div>

                        <Stack direction="column" spacing={0.2}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                {title}
                            </Typography>
                            <Typography variant="body1">
                                {subtitle}
                            </Typography>
                        </Stack>

                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );

}

export default OutlinedCard;