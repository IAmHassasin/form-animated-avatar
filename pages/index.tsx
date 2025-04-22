import React, { useState, useEffect, useCallback } from "react";
import AnimatedAvatar from "../form-animated-avatar";
import { FormGroup } from "@mui/material";

const Page: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedAvatar 
          eyeColor="#3f51b5"
          messageText="Your password is so WEEEEAAAK!!!"
          buttonText="Confirm"
          inputPlaceholder="Insert stronger password"
        />
      </div>
      );
}

export default Page;
