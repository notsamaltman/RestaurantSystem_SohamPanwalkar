import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from django.conf import settings

def generate_qr(link: str, filename: str) -> str:
    """
    Generates a QR code for the given link and saves it.
    Returns the relative path to the QR image.
    """

    qr = qrcode.QRCode(
        version=2,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    qr_dir = os.path.join(settings.MEDIA_ROOT, "qrcodes")
    os.makedirs(qr_dir, exist_ok=True)

    file_path = os.path.join(qr_dir, f"{filename}.png")
    img.save(file_path)

    return f"qr/{filename}.png"
