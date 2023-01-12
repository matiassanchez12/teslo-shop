import Document, { DocumentContext, Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initalProps = await Document.getInitialProps(ctx);

    return initalProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <script
            src="https://www.paypal.com/sdk/js?client-id=AYoFtmOw2TYTlYeLOcRFcKZIR3cUbCCqDmmmz2HYj9dhrlof5Vbzg7V-XCtOGwvtD9LopZoKECUUvZwV&vault=true"
            async
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
