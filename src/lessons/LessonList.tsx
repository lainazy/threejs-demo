import React from 'react';
import { Link } from 'react-router-dom';
import './lesson.list.scss';
import lessons from './lessons';

export default class LessonList extends React.Component {
  public render() {
    return (
      <div className="lesson-list">
        {
          lessons.map((lesson, index) => <Link className="lesson-link" to={`/${lesson}`} key={`lesson-${index + 1}`}>{lesson}</Link>)
        }
      </div>
    )
  }
}