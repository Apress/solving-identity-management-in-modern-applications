import React from 'react';
import {Label, Badge, Button} from 'reactstrap';
import { useArticle } from '../../Article/hook';

export function Grant({ identifier, permissions }) {
    const {revokeGrant} = useArticle();

    async function handleClick() {
        await revokeGrant(identifier);
    }

    return <div className="grant">
        <Label for="identifier" className="text-uppercase">
            <small>
                <small>Identifier</small>
            </small>
        </Label>
        <div className="text-truncate">
            <Button close onClick={handleClick} />
            <small>
                {identifier}
            </small> 
        </div>
        <Label for="identifier" className="text-uppercase">
            <small>
                <small>Permission</small>
            </small>
        </Label>
        <div>
            {permissions.map(permission => <Badge color="light">{permission}</Badge>)}
        </div>
    </div>
}