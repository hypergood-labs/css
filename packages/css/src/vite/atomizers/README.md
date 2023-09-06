# Atomizers

Atomizers are a kind of 'internal `utils`' that map from real CSS -> real CSS. Their job is to:

1. Split css declarations into multiple declarations if possible, like most things in https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties. e.g.:
   ```css
   .from {
     padding: 8px 16px !important;
   }

   .to {
     padding-top:    8px !important;
     padding-right:  16px !important;
     padding-bottom: 8px !important;
     padding-left:   16px !important;
   }
   ```

2. Convert css declarations into their shortest form, like [Lightning CSS](https://lightningcss.dev/minification.html) does. e.g.:
   ```css
   .from {
     border-radius:       8px / 8px;
     font-weight:         bold;
     background-position: center center;
     background-image:    url("logo.png");
     color:               rgba(255, 255, 0, 0.8);
     background-color:    #f00;
   }

   .to {
     border-radius:       8px;
     font-weight:         700;
     background-position: 50%;
     background-image:    url(logo.png);
     color:               #ff0c;
     background-color:    red;
   }
   ```

Technically there is a difference between 'shortest value string length' and 'least bytes on average when brotli compressed with a bunch of other declarations in a big css file', but I do not feel like measuring the difference.