import React from "react";
import { FileQuestion } from "lucide-react";

interface LanguageIconProps {
  language: string;
  className?: string;
}

export const LanguageIcon: React.FC<LanguageIconProps> = ({
  language,
  className,
}) => {
  const getIconClassName = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case "typescript":
        return "devicon-typescript-plain";
      case "javascript":
      case "js":
        return "devicon-javascript-plain";
      case "python":
        return "devicon-python-plain";
      case "go":
      case "golang":
        return "devicon-go-plain";
      case "rust":
        return "devicon-rust-plain";
      case "java":
        return "devicon-java-plain";
      case "html":
      case "html5":
        return "devicon-html5-plain";
      case "css":
      case "css3":
        return "devicon-css3-plain";
      case "c++":
      case "cpp":
        return "devicon-cplusplus-plain";
      case "c#":
      case "csharp":
        return "devicon-csharp-plain";
      case "php":
        return "devicon-php-plain";
      case "ruby":
        return "devicon-ruby-plain";
      case "shell":
      case "bash":
        return "devicon-bash-plain";
      case "swift":
        return "devicon-swift-plain";
      case "kotlin":
        return "devicon-kotlin-plain";
      case "scala":
        return "devicon-scala-plain";
      default:
        return "";
    }
  };

  const iconClassName = getIconClassName(language);

  if (iconClassName) {
    return <i className={`${iconClassName} ${className}`} />;
  }

  // Fallback to a generic Lucide icon for unknown languages
  return <FileQuestion className={className} />;
};
