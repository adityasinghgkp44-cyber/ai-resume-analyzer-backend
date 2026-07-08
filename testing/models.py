import google.generativeai as genai

genai.configure(api_key="AIzaSyCXZYMZsv9b2mkEXStYyFM4C_eLTUZoI7o")

for model in genai.list_models():
    print(model.name)