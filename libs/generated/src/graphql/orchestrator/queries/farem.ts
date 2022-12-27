import { graphql } from '../generated';

export const SUPPORTED_LANGUAGES = graphql(`
  query SupportedLanguages {
    supportedLanguages
  }
`);

export const LANGUAGE_EXAMPLE = graphql(`
  query LanguageExample($language: SupportedLanguage!) {
    languageExample(language: $language)
  }
`);

export const TOOLCHAIN_INFORMATION = graphql(`
  query ToolchainInformation {
    toolchainInformation {
      service
      version
      languageLogo
    }
  }
`);
