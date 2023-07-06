import SelectionObserver from './SelectionObserver';


describe('selection observer',()=>{
    const selectionvalue = {
        from: 0,
        to: 2
      };
      
      const selectionentry = {
        target: document.createElement('div'),
        selection: {
            from: 0,
            to: 2
          }
      };
    
      const selectionobserver1 = new SelectionObserver(()=>{});
      const callback = ([selectionentry],selectionobserver1)=>{}





    const selectionobserver = new SelectionObserver(()=>{});
    selectionobserver._observables = []
    it('should be defined',()=>{
        expect(selectionobserver).toBeDefined();
    })

    it ('should handle observe',()=>{
      selectionobserver._callback =([selectionentry],selectionobserver1)=>{}
      const elem = document.createElement('div')
      selectionobserver._observables = [{target:elem,selection:1} as unknown as never];
      expect(selectionobserver.observe(elem)).toBeUndefined();
    })
    it ('should handle observe',()=>{
        selectionobserver._callback =([selectionentry],selectionobserver1)=>{}
        const elem = document.createElement('div')
        selectionobserver._observables = [{target:elem,selection:1} as unknown as never];
        const spy = jest.spyOn(window,'getSelection').mockReturnValue(null);
        expect(selectionobserver.observe(elem)).toBeUndefined();
        spy.mockReset()
      })
      it ('should handle _onClick ',()=>{
        selectionobserver._callback =([selectionentry],selectionobserver1)=>{}
        const elem = document.createElement('div')
        selectionobserver._observables = [{target:elem,selection:1} as unknown as never];

        expect(selectionobserver._onClick()).toBeUndefined();
      })
      it ('should handle _check  ',()=>{
        selectionobserver._callback =([selectionentry],selectionobserver1)=>{}
        const elem = document.createElement('div')
        selectionobserver._observables = [{target:elem,selection:1} as unknown as never];

        expect(selectionobserver._check()).toBeUndefined();
      })
      it ('should handle _check selection===$selection ',()=>{
        selectionobserver._callback =([selectionentry],selectionobserver1)=>{}
        const elem = document.createElement('div')
        selectionobserver._observables = [{target:elem,selection:{from:0,to:0}} as unknown as never];

        expect(selectionobserver._check()).toBeUndefined();
      })
      it ('should handle disconnect',()=>{
        selectionobserver._callback =([selectionentry],selectionobserver1)=>{}
        const elem = document.createElement('div')
        //elem.addEventListener()
        selectionobserver._observables = [{target:elem,selection:{from:0,to:0}} as unknown as never];

        expect(selectionobserver.disconnect()).toBeUndefined();
      })
})