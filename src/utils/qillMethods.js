import "quill/dist/quill.snow.css";

export async function createQuillInstance(Quill, elem) {
  return new Quill(elem, {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    },
    theme: "snow",
  });
}

export async function getSelectedQuillData(quill) {
  const selection = quill.getSelection();
  const isTextSelected = !!selection && selection.length > 0;
  if (isTextSelected) {
    const selectedText = quill.getContents(selection.index, selection.length);
    return selectedText;
  }
  return "";
}

export async function getQuillData(quill) {
  const selectedText = quill.getContents();
  if (selectedText) return selectedText;
  return "";
}
