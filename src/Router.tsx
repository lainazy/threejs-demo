import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import LessonList from './lessons/LessonList';
import lessons from './lessons/lessons';

const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/lesson-list" component={LessonList} />
        {
          lessons.map((lesson, index) => <Route path={`/${lesson}`} component={require(`./lessons/${lesson}`)} key={index}></Route>)
        }
      </Switch>
    </HashRouter>
  )
}

export default Router;