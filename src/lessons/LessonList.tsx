import React from 'react';
import { Link } from 'react-router-dom';
import './lesson.list.scss';
import lessons from './lessons';
import { WEBGL } from 'three/examples/jsm/WebGL';

import { courseIds } from '../video-course/routes';

export default class LessonList extends React.Component {

  componentDidMount() {
    if (!WEBGL.isWebGLAvailable()) {
      const warning = WEBGL.getWebGLErrorMessage();
      const root = document.querySelector('#root');
      (root as HTMLDivElement).appendChild(warning);
    }
  }

  public render() {
    const list = [...lessons, ...courseIds];

    return (
      <div className="lesson-list">
        {
          list.map((lesson, index) => <Link className="lesson-link" to={`/${lesson}`} key={`lesson-${index + 1}`}>{lesson}</Link>)
        }
      </div>
    );
  }
}