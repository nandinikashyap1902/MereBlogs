import ReactQuill from "react-quill";

export default function Editor({value,onChange}) {
    const  modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ]
    }
    return (
        <ReactQuill
        onChange={onChange} 
            value={value}
            theme={'snow'}
        module={modules}> 
        </ReactQuill>
    )
}