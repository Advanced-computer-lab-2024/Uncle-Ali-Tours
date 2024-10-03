import {create} from 'zustand';
export const popupVisibility = create((set) => ({
    visibililty : false , 
    setVisibility : () => {
        set({visibililty:true})
            console.log("dd");
    },
    clearVisibility : () => set({visibililty:false})
}))