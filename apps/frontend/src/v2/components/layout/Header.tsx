import { Avatar, Box, Stack, Typography } from "@mui/material";
import { AppStore } from "../../../globalStores/AppStore";

const HEADER_HEIGHT = 72;

export const Header = () => {
    const { authStore } = AppStore;
    return (
        <Stack
            sx={{
                height: HEADER_HEIGHT,
                boxSizing: "border-box",
                bgcolor: "white",
                borderBottom: "1px solid #E2E8F0",
            }}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            p="24px"
        >
            <Box onClick={() => AppStore.navigate("/v2")} sx={{ cursor: "pointer" }}>
                <img src="/assets/tools-logo.svg" alt="logo" />
            </Box>
            {authStore.connected && (
                <Box
                    sx={{
                        border: "1px solid #CBD5E1",
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: "4px",
                    }}
                >
                    <Avatar
                        alt={authStore.user.username}
                        src={authStore.user.imageUrl}
                        sx={{ width: 24, height: 24 }}
                    />
                    <Typography>{authStore.user.username}</Typography>
                </Box>
            )}
        </Stack>
    );
};
