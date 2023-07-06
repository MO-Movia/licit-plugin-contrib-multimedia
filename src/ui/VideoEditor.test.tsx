import VideoEditor from './VideoEditor';

describe('VideoEditor',()=>{
    const props = {
        initialValue:{},
        close: (val) => {}
      };

      const state = {  id: 'id',
        src: 'src',
        width: 10,
        height: 10,
        validValue: true};
    const videoeditor = new VideoEditor(props,state);
 it('should be defined',()=>{
    expect(videoeditor).toBeDefined();
 });
 it('should be defined branch coverage',()=>{
    const props = {
        initialValue:null,
        close: (val) => {}
      };

      const state = {  id: 'id',
        src: 'src',
        width: 10,
        height: 10,
        validValue: true};
    const videoeditor = new VideoEditor(props,state);
    expect(videoeditor).toBeDefined();
 });

 it('should handle componentWillUnmount',()=>{
    //const spy = jest.spyOn(videoeditor,'_unmounted')
    videoeditor.componentWillUnmount();
    expect( videoeditor._unmounted ).toBeTruthy();
 });
 it('should handle render',()=>{

    const videoeditor = new VideoEditor(props,state);
    videoeditor.state = {  id: 'id',
    src: null,
    width: 10,
    height: 10,
    validValue: true};
    expect(videoeditor.render()).toBeDefined();
 });
 it('should handle render',()=>{

    const videoeditor = new VideoEditor(props,state);
    videoeditor.state = {  id: 'id',
    src: null,
    width: null,
    height: null,
    validValue: true};
    expect(videoeditor.render()).toBeDefined();
 });

 it('should handle _cancel ',()=>{

    const videoeditor = new VideoEditor(props,state);
    const spy =jest.spyOn(videoeditor.props,'close');
    videoeditor._cancel();
    expect(spy).toHaveBeenCalled();
 });
 it('should handle _insert  ',()=>{

    const videoeditor = new VideoEditor(props,state);
    const spy =jest.spyOn(videoeditor.props,'close');
    videoeditor._insert();
    expect(spy).toHaveBeenCalled();
 });

 it('should handle _getYouTubeId ',()=>{
    const videoeditor = new VideoEditor(props,state);
    expect(videoeditor._getYouTubeId('')).toBeDefined();
 });


});