"use client";

import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

type Props = {
  name: string;
  defaultValue?: string;
  height?: number;
  onChange?: (html: string) => void;
};

// Self-hosted TinyMCE (assets copied into public/tinymce at Docker build
// time, see Dockerfile) — no cloud API key, no usage nag. licenseKey="gpl"
// tells the editor it's running under TinyMCE's open-source license.
//
// The form still uses a plain server action reading FormData by field name
// (no client submit handler), so this renders a hidden <input> that always
// mirrors the editor's current HTML under the given `name`.
export default function RichTextEditor({ name, defaultValue = "", height = 420, onChange }: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <input type="hidden" name={name} value={value} readOnly />
      <div className="mt-1 overflow-hidden rounded-lg border border-slate-200">
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          initialValue={defaultValue}
          onEditorChange={(content) => {
            setValue(content);
            onChange?.(content);
          }}
          init={{
            height,
            menubar: false,
            branding: false,
            plugins: "link image lists table code blockquote hr autolink",
            toolbar:
              "undo redo | blocks | bold italic | bullist numlist | link image blockquote | alignleft aligncenter alignright | code",
            content_style: "body { font-family: system-ui, -apple-system, sans-serif; font-size: 14px }",
          }}
        />
      </div>
    </div>
  );
}
