export const socialProviders = {
    google: { loginUrl: 'google', alias: 'google', providerId: 'google', displayName: 'Google' },
    microsoft: {
        loginUrl: 'microsoft',
        alias: 'microsoft',
        providerId: 'microsoft',
        displayName: 'Microsoft',
    },
    facebook: {
        loginUrl: 'facebook',
        alias: 'facebook',
        providerId: 'facebook',
        displayName: 'Facebook',
    },
    instagram: {
        loginUrl: 'instagram',
        alias: 'instagram',
        providerId: 'instagram',
        displayName: 'Instagram',
    },
    twitter: {
        loginUrl: 'twitter',
        alias: 'twitter',
        providerId: 'twitter',
        displayName: 'Twitter',
    },
    linkedin: {
        loginUrl: 'linkedin',
        alias: 'linkedin',
        providerId: 'linkedin',
        displayName: 'LinkedIn',
    },
    stackoverflow: {
        loginUrl: 'stackoverflow',
        alias: 'stackoverflow',
        providerId: 'stackoverflow',
        displayName: 'Stackoverflow',
    },
    github: { loginUrl: 'github', alias: 'github', providerId: 'github', displayName: 'Github' },
    gitlab: { loginUrl: 'gitlab', alias: 'gitlab', providerId: 'gitlab', displayName: 'Gitlab' },
    bitbucket: {
        loginUrl: 'bitbucket',
        alias: 'bitbucket',
        providerId: 'bitbucket',
        displayName: 'Bitbucket',
    },
    paypal: { loginUrl: 'paypal', alias: 'paypal', providerId: 'paypal', displayName: 'PayPal' },
    openshift: {
        loginUrl: 'openshift',
        alias: 'openshift',
        providerId: 'openshift',
        displayName: 'OpenShift',
    },
};
export const allSocialProviders = Object.values(socialProviders);
