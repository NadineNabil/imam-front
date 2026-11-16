declare module '@ckeditor/ckeditor5-build-classic' {
	const ClassicEditorBuild: any;
	export = ClassicEditorBuild;
}

declare module 'wavesurfer.js' {
  const WaveSurfer: any;
  export default WaveSurfer;
}

declare module 'wavesurfer.js/dist/plugins/record.js' {
  const RecordPlugin: any;
  export default RecordPlugin;
}

declare module 'katex/dist/contrib/auto-render' {
  const renderMathInElement: (element: HTMLElement, options?: any) => void;
  export default renderMathInElement;
}

