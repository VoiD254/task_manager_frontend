import { createContext, useContext, useState } from "react";

const ResetTokenContext = createContext();

const ResetTokenProvider = ({ children }) =>{
    const [resetToken, setResetToken] = useState(null);

    return(
        <ResetTokenContext value = {{ resetToken, setResetToken }}>
            {children}
        </ResetTokenContext>
    );
};

const useResetToken = () => useContext(ResetTokenContext);

export {
    ResetTokenProvider,
    useResetToken
};
