import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Editor } from './Editor';
import { Callback } from './Callback';
import { ArticleProvider } from './Article/hook';
import { Profile } from './Profile/Profile';

export default () => (
    <Switch>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/callback"><Callback /></Route>
      <Route path="/:articleId/:articleVersion">
        <ArticleProvider>
          <Editor />
        </ArticleProvider>
      </Route>
      <Route path="/:articleId">
        <ArticleProvider>
          <Editor />
        </ArticleProvider>
      </Route>
      <Redirect to="/new" />
    </Switch>
);
