from PIL import Image

image_path = "d:/FCI - GP/YS_NEXUS/Front/NEXUS ICON (FINAL) (2).png"
# image_path = "d:/FCI - GP/YS_NEXUS/Front/NEXUS ICON (FINAL) (3).png"
output_path = "d:/FCI - GP/YS_NEXUS/Front/NEXUS_ICON_CROPPED.png"

try:
    img = Image.open(image_path)
    
    # Get bounding box of non-transparent pixels
    # Split the image into channels
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        alpha = img.convert('RGBA').split()[-1]
        bbox = alpha.getbbox()
        
        if bbox:
            # Crop the image to the bounding box
            img_cropped = img.crop(bbox)
            
            # Save the cropped image
            img_cropped.save(output_path)
            print(f"Successfully cropped image. New size: {img_cropped.size}")
        else:
            print("Image is entirely transparent or bounding box not found.")
    else:
        print("Image does not have an alpha channel.")
        
except Exception as e:
    print(f"Error: {e}")
