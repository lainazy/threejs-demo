import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import LessonList from './lessons/LessonList';
import Lesson1 from './lessons/lesson1';
import Lesson2 from './lessons/lesson2';
import Lesson3 from './lessons/lesson3';

const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/lesson-list" component={LessonList} />
        <Route path="/lesson1" component={Lesson1} />
        <Route path="/lesson2" component={Lesson2} />
        <Route path="/lesson3" component={Lesson3} />
      </Switch>
    </HashRouter>
  );
};

export default Router;