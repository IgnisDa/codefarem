/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	AccountType: "enum" as const,
	CreateClassInput:{
		teacherIds:"UUID"
	},
	CreateQuestionInput:{
		classIds:"UUID",
		testCases:"TestCase"
	},
	ExecuteCodeErrorStep: "enum" as const,
	ExecuteCodeInput:{
		language:"SupportedLanguage"
	},
	InputCaseUnit:{
		dataType:"TestCaseUnit"
	},
	LoginError: "enum" as const,
	LoginUserInput:{

	},
	MutationRoot:{
		executeCode:{
			input:"ExecuteCodeInput"
		},
		registerUser:{
			input:"RegisterUserInput"
		},
		createClass:{
			input:"CreateClassInput"
		},
		createQuestion:{
			input:"CreateQuestionInput"
		}
	},
	OutputCaseUnit:{
		dataType:"TestCaseUnit"
	},
	QueryRoot:{
		languageExample:{
			language:"SupportedLanguage"
		},
		userWithEmail:{
			input:"UserWithEmailInput"
		},
		loginUser:{
			input:"LoginUserInput"
		},
		classDetails:{
			classId:"UUID"
		}
	},
	RegisterUserInput:{
		accountType:"AccountType"
	},
	SupportedLanguage: "enum" as const,
	TestCase:{
		inputs:"InputCaseUnit",
		outputs:"OutputCaseUnit"
	},
	TestCaseUnit: "enum" as const,
	UUID: `scalar.UUID` as const,
	UserWithEmailInput:{

	}
}

export const ReturnTypes: Record<string,any> = {
	ApiError:{
		error:"String"
	},
	ClassDetailsOutput:{
		name:"String"
	},
	ClassDetailsResultUnion:{
		"...on ClassDetailsOutput":"ClassDetailsOutput",
		"...on ApiError":"ApiError"
	},
	CreateClassOutput:{
		id:"UUID"
	},
	CreateClassResultUnion:{
		"...on CreateClassOutput":"CreateClassOutput",
		"...on ApiError":"ApiError"
	},
	CreateQuestionOutput:{
		id:"UUID"
	},
	CreateQuestionResultUnion:{
		"...on CreateQuestionOutput":"CreateQuestionOutput",
		"...on ApiError":"ApiError"
	},
	ExecuteCodeError:{
		error:"String",
		step:"ExecuteCodeErrorStep"
	},
	ExecuteCodeOutput:{
		output:"String"
	},
	ExecuteCodeResultUnion:{
		"...on ExecuteCodeOutput":"ExecuteCodeOutput",
		"...on ExecuteCodeError":"ExecuteCodeError"
	},
	LoginUserError:{
		error:"LoginError"
	},
	LoginUserOutput:{
		token:"String"
	},
	LoginUserResultUnion:{
		"...on LoginUserOutput":"LoginUserOutput",
		"...on LoginUserError":"LoginUserError"
	},
	MutationRoot:{
		executeCode:"ExecuteCodeResultUnion",
		registerUser:"RegisterUserResultUnion",
		createClass:"CreateClassResultUnion",
		createQuestion:"CreateQuestionResultUnion"
	},
	QueryRoot:{
		supportedLanguages:"SupportedLanguage",
		languageExample:"String",
		userDetails:"UserDetailsResultUnion",
		userWithEmail:"UserWithEmailResultUnion",
		loginUser:"LoginUserResultUnion",
		logoutUser:"Boolean",
		testCaseUnits:"TestCaseUnit",
		classDetails:"ClassDetailsResultUnion"
	},
	RegisterUserError:{
		usernameNotUnique:"Boolean",
		emailNotUnique:"Boolean"
	},
	RegisterUserOutput:{
		id:"UUID"
	},
	RegisterUserResultUnion:{
		"...on RegisterUserOutput":"RegisterUserOutput",
		"...on RegisterUserError":"RegisterUserError"
	},
	UUID: `scalar.UUID` as const,
	UserDetailsOutput:{
		profile:"UserProfileInformation",
		accountType:"AccountType"
	},
	UserDetailsResultUnion:{
		"...on UserDetailsOutput":"UserDetailsOutput",
		"...on ApiError":"ApiError"
	},
	UserProfileInformation:{
		email:"String",
		username:"String"
	},
	UserWithEmailError:{
		error:"String"
	},
	UserWithEmailOutput:{
		id:"UUID"
	},
	UserWithEmailResultUnion:{
		"...on UserWithEmailOutput":"UserWithEmailOutput",
		"...on UserWithEmailError":"UserWithEmailError"
	}
}

export const Ops = {
mutation: "MutationRoot" as const,
	query: "QueryRoot" as const
}