
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import React from 'react';
import ImageURLEditor from './ImageURLEditor';
import * as resolveimage from './resolveImage';
Enzyme.configure({ adapter: new Adapter() });

describe('Image URL Editor', () => {
  const ImageEditorProps = {
    close: () => { },
    initialValue: {}
  };
  const imageurleditor = new ImageURLEditor(ImageEditorProps);
  it('should be defined', () => {
    expect(imageurleditor).toBeDefined();

  });

  it('should handle componentWillUnmount', () => {
    imageurleditor.componentWillUnmount();
    expect(imageurleditor._unmounted).toBeTruthy();

  });

  it('should handle render', () => {
    //imageurleditor.componentWillUnmount()
    imageurleditor.state = { src: '', validValue: { src: '' } };
    expect(imageurleditor.render()).toBeDefined();

  });

  it('should handle render branch coverage', () => {
    //imageurleditor.componentWillUnmount()
    imageurleditor.state = { src: '', validValue: null };
    expect(imageurleditor.render()).toBeDefined();

  });

  it('should handle _didSrcChange ', () => {
    const spy = jest.spyOn(resolveimage,'default').mockResolvedValue({
      complete: true,
      height: 10,
      naturalHeight: 10,
      naturalWidth: 10,
      src: '',
      width: 10
    });
    imageurleditor._unmounted = false;
    imageurleditor.state = { src: '', validValue: { src: '' } };
    expect(imageurleditor._didSrcChange()).toBeUndefined();



  });
  it('should handle _didSrcChange when result.complete = false ', () => {
    const spy = jest.spyOn(resolveimage,'default').mockResolvedValue({
      complete: false,
      height: 10,
      naturalHeight: 10,
      naturalWidth: 10,
      src: '',
      width: 10
    });
    imageurleditor._unmounted = false;
    imageurleditor.state = { src: '', validValue: { src: '' } };
    expect(imageurleditor._didSrcChange()).toBeUndefined();
  });

  it('should handle _didSrcChange when result.complete = false ', () => {
    const spy = jest.spyOn(imageurleditor.props,'close');
    imageurleditor._cancel ();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle _didSrcChange when result.complete = false ', () => {
    const spy = jest.spyOn(imageurleditor.props,'close');
    imageurleditor._insert();
    expect(spy).toHaveBeenCalled();
  });
  const ImageEditorProps1 = {
    close: () => { },
    initialValue:null
  };
  const imageurleditor1 = new ImageURLEditor(ImageEditorProps1);
  it('should be defined', () => {
    expect(imageurleditor1.state).toBeDefined();

  });
});