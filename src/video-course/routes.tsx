import React from 'react';
import { Route } from 'react-router-dom';

export const courseIds = [
  '2-立方体',
  '4-线',
  '5-立方体+坐标系',
  '6-statsjs+tweenjs库使用',
  '9-dat.gui库使用',
  '13,14,15-光源+4种dat.gui颜色修改方式',
  '16,17,18-纹理加载',
  '19,20-顶点+三角形+面',
  '21,22,23-FBX模型加载',
  '27,28-高性能绘制大数据量的三角形',
  '29-高性能绘制大数据量的点',
  '30,31,32-OBJ模型加载+纹理设置',
  '38,39-鼠标拾取+球形分布',
  '44~48-粒子模型动画',
  '64~71-柔性布料受力运动效果(未完成)'
];

export default courseIds.map((id) => {
  return <Route key={id} path={`/${id}`} component={React.lazy(() => import(`./${id}`))} />;
});