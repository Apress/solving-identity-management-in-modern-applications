import React, { useEffect, useState } from 'react';
import { useAuth } from './Auth/hook';
import { Redirect } from 'react-router-dom';

export function Callback() {
    const auth = useAuth();
    const [lock, updateLock] = useState(true);

    useEffect(() => {
        (async () => {
            await auth.handleCallback();
            updateLock(false);
        })();
    }, [auth]);

    if (lock) {
        return <div><div className="loading">Loading...</div></div>
    }

    return <Redirect to="/" />;
}